import { AppDataSource } from '../database/database';
import { FichaAnamnese } from '../models/fichaanamnese.entity';
import { CreateFichaAnamneseDto } from '../dtos/anamnese/create-ficha-anamnese.dto';
import { FichaAnamneseResponseDto } from '../dtos/anamnese/ficha-anamnese-response.dto';
import { AlergiaService } from './alergia.service';
import { FichaPossuiAlergiasService } from './ficha-possui-alergias.service';
import { AlergiaResponseDto } from '../dtos/alergia/alergia-response.dto';

export class FichaAnamneseService {
    private fichaRepo = AppDataSource.getRepository(FichaAnamnese);
    
    private alergiaService = new AlergiaService();
    private ligacaoService = new FichaPossuiAlergiasService();

    async criar(dados: CreateFichaAnamneseDto): Promise<FichaAnamneseResponseDto> {
        
        // 1. Criamos o objeto à parte, lidando com os undefined transformando-os em null
        const dadosParaCriar: any = {
            id_utente: dados.id_utente,
            estadoTabagico: dados.estadoTabagico ?? null,
            antecedentes: dados.antecedentes ?? null,
            peso: dados.peso ?? null,
            altura: dados.altura ?? null
        };

        const novaFicha = this.fichaRepo.create(dadosParaCriar);
        
        // 2. O duplo cast mágico para o TypeORM perceber que é só 1 objeto e não um Array
        const fichaGuardada = (await this.fichaRepo.save(novaFicha)) as unknown as FichaAnamnese;

        // Criar array para devolver as alergias
        let alergiasDevolvidas: AlergiaResponseDto[] = [];

        if (dados.alergias && dados.alergias.length > 0) {
            for (const nomeAlergia of dados.alergias) {
                const alergia = await this.alergiaService.encontrarOuCriar(nomeAlergia);
                
                await this.ligacaoService.criarLigacao(fichaGuardada.id_ficha, alergia.id_alergia);

                alergiasDevolvidas.push({
                    id_alergia: alergia.id_alergia,
                    nomeAlergia: alergia.nomeAlergia
                });
            }
        }

        // 3. Forçamos o 'as any' no final para não haver queixas com os tipos de datas
        return {
            id_ficha: fichaGuardada.id_ficha,
            id_utente: fichaGuardada.id_utente,
            estadoTabagico: fichaGuardada.estadoTabagico || null,
            antecedentes: fichaGuardada.antecedentes || null,
            peso: fichaGuardada.peso || null,
            altura: fichaGuardada.altura || null,
            createdAt: fichaGuardada.createdAt,
            updatedAt: fichaGuardada.updatedAt,
            alergias: alergiasDevolvidas 
        } as any;
    }
}