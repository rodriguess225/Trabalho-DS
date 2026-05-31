import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { CaratResponseDto } from '../dtos/carat/carat-response.dto';
import { Alerta } from '../models/alerta.entity';
import { LogAuditoria } from '../models/logauditoria.entity';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { Utente } from '../models/utente.entity';

export class CaratService {
    private repo = AppDataSource.getRepository(AvaliacaoCarat);
   private alertaRepo = AppDataSource.getRepository(Alerta);
    private logRepo = AppDataSource.getRepository(LogAuditoria);
    private limiarRepo = AppDataSource.getRepository(ConfiguracaoLimiares);
    private utenteRepo = AppDataSource.getRepository(Utente);

    async submeterAvaliacao(dados: CreateCaratDto): Promise<CaratResponseDto> {
        console.log("DADOS RECEBIDOS NO SERVICE:", dados);
        const utenteLogado = await this.utenteRepo.findOne({
            where: { id: dados.utente_id } 
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

// 2. Fazer as contas com as variáveis novas
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
        } else {
            await this.alertaRepo.save(this.alertaRepo.create({
            utente: utenteLogado,
                tipoAlerta: "CRÍTICO",
               descricao: "ALERTA: Utente " + utenteLogado.nome + " com score " + scoreTotal + ". Requer revisao urgente.",
               lido: false
            }));
        }

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

        await this.logRepo.save({
            id_utilizador: 0,
          tipoAcao: "CREATE",
        entidade: "AvaliacaoCARAT",
            id_registo_afetado: guardada.id,
           dataHora: new Date().toISOString()
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
            utente_id: avaliacao.utente?.id || 'ID Desconhecido',
            scoreSuperiores: avaliacao.scoreSuperiores,
            scoreInferiores: avaliacao.scoreInferiores,
            scoreTotal: avaliacao.scoreTotal,
            nivelControlo: avaliacao.nivelControlo,
            recomendacoes: avaliacao.recomendacoes,
            proximoPassoSugerido: avaliacao.proximoPassoSugerido,
            dataAvaliacao: avaliacao.dataAvaliacao // Aqui está o campo que faltava!
        };
    }
}