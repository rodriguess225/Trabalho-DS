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
        const utenteLogado = await this.utenteRepo.findOne({
            where: { id: dados.utente_id as any } 
        });

        if (!utenteLogado) {
            throw new Error("Utente não encontrado.");
        }

        const config = await this.limiarRepo.findOne({ order: { id_configuracao: 'DESC' } });
        const scoreCorte = config ? config.limiar_score : 24;

        const scoreSuperiores = dados.q1 + dados.q2 + dados.q3 + dados.q4;
        const scoreInferiores = dados.q5 + dados.q6 + dados.q7 + dados.q8 + dados.q9 + dados.q10;
        const scoreTotal = scoreSuperiores + scoreInferiores;

        let nivelControlo = "Asma Não Controlada";
        let recomendacoes = "Necessária revisão da técnica inalatória e adesão terapêutica.";
        let proximoPassoSugerido = "Agendar consulta de revisão urgente.";

        if (scoreTotal >= scoreCorte) {
            nivelControlo = "Asma e Rinite Controladas";
            recomendacoes = "Manter a medicação atual e vigilância periódica.";
            proximoPassoSugerido = "Reavaliar em 6 meses.";
        } else {
            await this.alertaRepo.save({
                utente: utenteLogado,
                tipoAlerta: "CRÍTICO",
                descricao: `ALERTA: Utente ${utenteLogado.nome} com score ${scoreTotal}.`,
                lido: false
            });
        }

        const guardada = await this.repo.save(this.repo.create({
            ...dados,
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
} // <--- Esta chaveta fecha a classe