import { AppDataSource } from '../database/database';
import { RespostaCarat } from '../models/respostacarat.entity';

export class RespostaCaratService {
    private repo = AppDataSource.getRepository(RespostaCarat);

    /**
     * Guarda individualmente uma resposta associada a uma avaliação
     */
    async criarResposta(id_avaliacao: number, num_pergunta: number, valor_pontuacao: number): Promise<RespostaCarat> {
        const novaResposta = this.repo.create({
            id_avaliacao: id_avaliacao,
            num_pergunta: num_pergunta,
            valor_pontuacao: valor_pontuacao
        });

        return await this.repo.save(novaResposta);
    }
}