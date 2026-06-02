import { AppDataSource } from '../database/database';
import { FichaPossuiAlergias } from '../models/ficha_possui_alergias.entity';

export class FichaPossuiAlergiasService {
    private repo = AppDataSource.getRepository(FichaPossuiAlergias);

    async criarLigacao(idFicha: number, idAlergia: number): Promise<FichaPossuiAlergias> {
        const ligacao = this.repo.create({
            id_ficha_anamnese: idFicha,
            id_alergia: idAlergia
        });
        
        return await this.repo.save(ligacao);
    }
}