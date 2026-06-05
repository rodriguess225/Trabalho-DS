import { AppDataSource } from '../database/database';
import { RespostaCarat } from '../models/respostacarat.entity';

export class RespostaCaratService {
    private repo = AppDataSource.getRepository(RespostaCarat);

    
     // Guarda individualmente uma resposta associada a uma avaliação
     
    async criarResposta(id_avaliacao: number, num_pergunta: number, valor_pontuacao: number): Promise<RespostaCarat> {
        
        const dadosParaCriar: any = {
            avaliacaoId: id_avaliacao, // Na entidade chama-se avaliacaoId
            num_pergunta: num_pergunta,
            valor: valor_pontuacao     // Na entidade chama-se valor
        };

        const novaResposta = this.repo.create(dadosParaCriar);

        const respostaGuardada = (await this.repo.save(novaResposta)) as unknown as RespostaCarat;

        return respostaGuardada;
    }
}