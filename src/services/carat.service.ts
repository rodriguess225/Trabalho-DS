import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { CaratResponseDto } from '../dtos/carat/carat-response.dto';

export class CaratService {

    private repo = AppDataSource.getRepository(AvaliacaoCarat);

    async submeterAvaliacao(dados: CreateCaratDto): Promise<CaratResponseDto> {
        
        // 1. Validação simples de segurança (garantir que as respostas estão entre 0 e 3)
        const respostas = [dados.q1, dados.q2, dados.q3, dados.q4, dados.q5, dados.q6, dados.q7, dados.q8, dados.q9, dados.q10];
        if (respostas.some(r => r < 0 || r > 3)) {
            throw new Error("As respostas do CARAT devem estar entre 0 e 3.");
        }

        // 2. Lógica de Negócio (Cálculos)
        const scoreSuperiores = dados.q1 + dados.q2 + dados.q3 + dados.q4;
        const scoreInferiores = dados.q5 + dados.q6 + dados.q7 + dados.q8 + dados.q9 + dados.q10;
        const scoreTotal = scoreSuperiores + scoreInferiores;

        let nivelControlo = "Controlo Insuficiente (Alerta)";
        if (scoreTotal > 24) {
            nivelControlo = "Asma e Rinite Controladas";
        }

        // 3. Persistir na Base de Dados
        const novaAvaliacao = this.repo.create({
            ...dados,
            scoreSuperiores,
            scoreInferiores,
            scoreTotal,
            nivelControlo,
            dataAvaliacao: new Date()
        });

        const guardada = await this.repo.save(novaAvaliacao);
        
        // 4. Devolver usando DTO Assembler
        return this.toResponseDto(guardada);
    }

    async listarAvaliacoes(): Promise<CaratResponseDto[]> {
        const avaliacoes = await this.repo.find();
        return avaliacoes.map((avaliacao) => this.toResponseDto(avaliacao));
    }

    // Método DTO Assembler privado (como têm no prescricao.service.ts)
    private toResponseDto(avaliacao: AvaliacaoCarat): CaratResponseDto {
        return {
            id: avaliacao.id,
            utente_id: avaliacao.utente_id,
            scoreSuperiores: avaliacao.scoreSuperiores,
            scoreInferiores: avaliacao.scoreInferiores,
            scoreTotal: avaliacao.scoreTotal,
            nivelControlo: avaliacao.nivelControlo,
            dataAvaliacao: avaliacao.dataAvaliacao
        };
    }
}