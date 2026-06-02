import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { CaratResponseDto } from '../dtos/carat/carat-response.dto';
import { Utente } from '../models/utente.entity';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';

// Importamos os SERVICES e não as Entidades/Repos de outras tabelas!
import { AlertaService } from './alerta.service';
import { LogAuditoriaService } from './logauditoria.service';

export class CaratService {
    private repo = AppDataSource.getRepository(AvaliacaoCarat);
    private limiarRepo = AppDataSource.getRepository(ConfiguracaoLimiares);
    private utenteRepo = AppDataSource.getRepository(Utente);
    
    // Injeção de dependências (O padrão que o teu amigo usou nas alergias)
    private alertaService = new AlertaService();
    private logService = new LogAuditoriaService();

    async submeterAvaliacao(dados: CreateCaratDto, id_utilizador_que_submeteu: number): Promise<CaratResponseDto> {
        console.log("DADOS RECEBIDOS NO SERVICE:", dados);
        
        const utenteLogado = await this.utenteRepo.findOne({
            where: { id_utente: dados.utente_id } // ATENÇÃO: Confirma se na tua entidade o nome é 'id' ou 'id_utente'
        });

        if (!utenteLogado) {
            throw new Error("Utente não encontrado.");
        }

        let scoreCorte = 24;
        try {
            const config = await this.limiarRepo.findOne({ where: {}, order: { id_configuracao: 'DESC' } });
            if (config) scoreCorte = config.limiar_score;
        } catch (e) {
            console.log("A usar score de corte padrão (24)");
        }

        // 1. Garantir que cada resposta é tratada como um Número
        const q1 = Number(dados.q1 || 0);
        const q2 = Number(dados.q2 || 0);
        const q3 = Number(dados.q3 || 0);
        const q4 = Number(dados.q4 || 0);
        const q5 = Number(dados.q5 || 0);
        const q6 = Number(dados.q6 || 0);
        const q7 = Number(dados.q7 || 0);
        const q8 = Number(dados.q8 || 0);
        const q9 = Number(dados.q9 || 0);
        const q10 = Number(dados.q10 || 0);

        // 2. Fazer as contas com as variáveis clínicas
        const scoreSuperiores = q1 + q2 + q3 + q4;
        const scoreInferiores = q5 + q6 + q7 + q8 + q9 + q10;
        const scoreTotal = scoreSuperiores + scoreInferiores;

        let nivelControlo = "Asma Não Controlada";
        let recomendacoes = "Necessária revisão da técnica inalatória e adesão terapêutica.";
        let proximoPassoSugerido = "Agendar consulta de revisão urgente.";

        if (scoreTotal >= scoreCorte) {
            nivelControlo = "Asma e Rinite Controladas";
            recomendacoes = "Manter a medicação atual e vigilância periódica.";
            proximoPassoSugerido = "Reavaliar em 6 meses.";
        } 

        // 3. Guardar a Avaliação PRIMEIRO
        const guardada = await this.repo.save(this.repo.create({
            ...dados,
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
            scoreSuperiores,
            scoreInferiores,
            scoreTotal,
            nivelControlo,
            recomendacoes,
            proximoPassoSugerido,
            dataAvaliacao: new Date(),
            utente: utenteLogado
        }));

        // 4. Gatilho de Alertas (Usando o AlertaService para manter a arquitetura limpa)
        if (scoreTotal < scoreCorte) {
            await this.alertaService.gerarAlerta({
                id_utente: utenteLogado.id_utente,
                id_medico: utenteLogado.id_medico || 1, // Assumir um médico ou sacar da ficha
                id_avaliacao_origem: guardada.id,
                tipo: "CRÍTICO - CARAT",
                prioridade: scoreTotal <= 15 ? 'ALTA' : 'MÉDIA',
                motivo: `ALERTA: Utente ${utenteLogado.id_utilizador} com score ${scoreTotal}. Requer revisão urgente.`
            });
        }

        // 5. Auditoria Correta (Usando o LogService e o ID de quem realmente fez o pedido)
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_submeteu,
            tipoAcao: "CREATE",
            entidadeAfetada: "AvaliacaoCARAT",
            id_registo_afetado: guardada.id,
            valorNovo: JSON.stringify({ scoreTotal, nivelControlo })
        });

        return this.toResponseDto(guardada);
    }

    async listarAvaliacoes(): Promise<CaratResponseDto[]> {
        try {
            const avaliacoes = await this.repo.find({
                relations: ['utente'],
                order: { dataAvaliacao: 'DESC' }
            });
            
            return avaliacoes.map((avaliacao) => this.toResponseDto(avaliacao));
        } catch (error) {
            console.error("Erro no Service ao listar:", error);
            return [];
        }
    }

    private toResponseDto(avaliacao: AvaliacaoCarat): CaratResponseDto {
        return {
            id: avaliacao.id,
            utente_id: avaliacao.utente?.id_utente || 'ID Desconhecido',
            scoreSuperiores: avaliacao.scoreSuperiores,
            scoreInferiores: avaliacao.scoreInferiores,
            scoreTotal: avaliacao.scoreTotal,
            nivelControlo: avaliacao.nivelControlo,
            recomendacoes: avaliacao.recomendacoes,
            proximoPassoSugerido: avaliacao.proximoPassoSugerido,
            dataAvaliacao: avaliacao.dataAvaliacao
        };
    }
}