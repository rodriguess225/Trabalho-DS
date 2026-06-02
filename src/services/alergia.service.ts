import { AppDataSource } from '../database/database';
import { Alergia } from '../models/alergia.entity';

export class AlergiaService {
    private repo = AppDataSource.getRepository(Alergia);

    // Procura uma alergia pelo nome, ou cria se não existir (encapsulamos a lógica aqui!)
    async encontrarOuCriar(nomeAlergia: string): Promise<Alergia> {
        const nomeLimpo = nomeAlergia.trim();
        let alergia = await this.repo.findOneBy({ nomeAlergia: nomeLimpo });

        if (!alergia) {
            const novaAlergia = this.repo.create({ nomeAlergia: nomeLimpo });
            alergia = await this.repo.save(novaAlergia);
        }

        return alergia;
    }

    // Para o Frontend poder listar todas as alergias disponíveis
    async listarTodas(): Promise<Alergia[]> {
        return await this.repo.find();
    }
}