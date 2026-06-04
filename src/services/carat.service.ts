import { AppDataSource } from '../database/database';
import { AvaliacaoCARAT } from '../models/avaliacao-carat.entity';
import { RespostaCarat } from '../models/respostacarat.entity';
import { CreateAvaliacaoCaratDto } from '../dtos/carat/create-carat.dto'; 
import { CaratResponseDto } from '../dtos/carat/carat-response.dto';
import { Utente } from '../models/utente.entity';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { AlertaService } from './alerta.service';
import { LogAuditoriaService } from './logauditoria.service';

export class CaratService {
    private repo = AppDataSource.getRepository(AvaliacaoCARAT);
    private limiarRepo = AppDataSource.getRepository(ConfiguracaoLimiares);
    private utenteRepo = AppDataSource.getRepository(Utente);
    private alertaService = new AlertaService();
    private logService = new LogAuditoriaService();

    async submeterAvaliacao(dados: CreateAvaliacaoCaratDto, id_utilizador_que_submeteu: number): Promise<CaratResponseDto> {
        console.log("DADOS RECEBIDOS NO SERVICE:", dados);

        // 1. Validar a existência do Utente
        const utenteLogado = await this.utenteRepo.findOne({
            where: { id_utente: dados.id_utente }
        });
        if (!utenteLogado) {
            throw new Error("Utente não encontrado no sistema.");
        }

        // 2. Buscar Configurações de Limiares na Base de Dados
        let scoreCorte = 24; // Valor padrão por omissão
        let config: ConfiguracaoLimiares | null = null;
        try {
            config = await this.limiarRepo.findOne({ where: {}, order: { id_configuracao: 'DESC' } });
            if (config) {
                scoreCorte = config.limiar_score;
            }
        } catch (e) {
            console.log("A usar score de corte padrão (24)");
        }

        // 3. Processar Array de Respostas (Substitui o hardcoded antigo)
        let scoreSuperiores = 0;
        let scoreInferiores = 0;

        for (const resp of dados.respostas) {
            const num = Number(resp.num_pergunta);
            const pontos = Number(resp.valor_pontuacao);

            if (num >= 1 && num <= 4) {
                scoreSuperiores += pontos;
            } else if (num >= 5 && num <= 10) {
                scoreInferiores += pontos;
            }
        }
        const scoreTotal = scoreSuperiores + scoreInferiores;

        // 4. Algoritmo do Requisito RF10 (Alerta de Deterioração Clínica)
        const ultimaAvaliacao = await this.repo.findOne({
            where: { utenteId: utenteLogado.id_utente },
            order: { dataAvaliacao: 'DESC' }
        });

        let dispararAlertaDeterioracao = false;
        let deltaQueda = 0;

        if (ultimaAvaliacao) {
            deltaQueda = ultimaAvaliacao.scoreTotal - scoreTotal;
            // No vosso model está mapeado com caracteres especiais devido ao encoding: limiar_delta_deterorizaÃ§Ã£o
            const deltaPermitido = config?.limiar_delta_deterioracao || 4; 
            
            if (deltaQueda >= deltaPermitido) {
                dispararAlertaDeterioracao = true;
            }
        }

        // 5. Definir Nível de Controlo e Recomendações Clínicas
        let nivelControlo = "Asma Não Controlada";
        let recomendacoes = "Necessária revisão da técnica inalatória e adesão terapêutica.";
        let proximoPassoSugerido = "Agendar consulta de revisão urgente.";

        if (scoreTotal >= scoreCorte) {
            nivelControlo = "Asma e Rinite Controladas";
            recomendacoes = "Manter a medicação atual e vigilância periódica.";
            proximoPassoSugerido = "Reavaliar em 6 meses.";
        }

        // 6. Persistir Avaliação Principal na Base de Dados
        const avaliacaoGuardada = await this.repo.save(this.repo.create({
            utenteId: utenteLogado.id_utente,
            scoreTotal,
            scoreViasSuperiores: scoreSuperiores,
            scoreViasInferiores: scoreInferiores,
            nivelControlo,
            recomendacoes,
            proximoPassoSugerido,
            dataAvaliacao: new Date()
        }));

        // 7. Persistir Cada Resposta Individual (Resolve o Problema de Persistência)
        const respostaRepo = AppDataSource.getRepository(RespostaCarat);
        for (const resp of dados.respostas) {
            await respostaRepo.save(respostaRepo.create({
                avaliacaoId: avaliacaoGuardada.id,
                num_pergunta: resp.num_pergunta,
                valor: resp.valor_pontuacao 
            }));
        }

        // 8. Gatilho de Alerta 1: Controlo Insuficiente (Score abaixo do limiar)
        if (scoreTotal < scoreCorte) {
            await this.alertaService.gerarAlerta({
                id_utente: utenteLogado.id_utente,
                id_medico: utenteLogado.id_medico || 1,
                id_avaliacao_origem: avaliacaoGuardada.id,
                tipo: "CRÍTICO - CONTROL INSUFICIENTE",
                prioridade: scoreTotal <= 15 ? 'ALTA' : 'MÉDIA',
                motivo: `ALERTA: Utente com score ${scoreTotal} (Abaixo do limiar de ${scoreCorte}).`
            });
        }

        // 9. Gatilho de Alerta 2: Deterioração Abrupta (RF10)
        if (dispararAlertaDeterioracao) {
            await this.alertaService.gerarAlerta({
                id_utente: utenteLogado.id_utente,
                id_medico: utenteLogado.id_medico || 1,
                id_avaliacao_origem: avaliacaoGuardada.id,
                tipo: "AVISO - DETERIORAÇÃO CLÍNICA",
                prioridade: 'ALTA',
                motivo: `ALERTA RF10: Queda abrupta detetada! O score desceu ${deltaQueda} pontos face à última avaliação.`
            });
        }

        // 10. Registar Log de Auditoria Obrigatório do Sistema
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_submeteu,
            tipoAcao: "CREATE",
            entidadeAfetada: "AvaliacaoCARAT",
            id_registo_afetado: avaliacaoGuardada.id,
            valorNovo: JSON.stringify({ scoreTotal, nivelControlo, deterioracao: dispararAlertaDeterioracao })
        });

        return avaliacaoGuardada;
    }

    // Método auxiliar para listar que as vossas rotas usam
    async listarAvaliacoes(): Promise<AvaliacaoCARAT[]> {
        return await this.repo.find({
            order: { dataAvaliacao: 'DESC' }
        });
    }

  async obterHistoricoUtente(id_utente: number) {
        try {

            if (!id_utente || isNaN(id_utente)) {
                return [];
            }
            const caratRepo = AppDataSource.getRepository(AvaliacaoCARAT);

            const historico = await caratRepo.find({
                where: { utenteId: id_utente } as any
            });

            historico.sort((a: any, b: any) => {
                const dataA = new Date(a.createdAt || a.dataAvaliacao || a.id).getTime();
                const dataB = new Date(b.createdAt || b.dataAvaliacao || b.id).getTime();
                return dataA - dataB;
            });

            return historico;
        } catch (error) {
            console.error("ERRO NO TYPEORM (obterHistorico):", error);
            throw new Error("Erro na BD");
        }
    }
}