import { AppDataSource } from '../database/database';
import { FichaAnamnese } from '../models/fichaanamnese.entity';
import { CreateFichaAnamneseDto } from '../dtos/anamnese/create-ficha-anamnese.dto';
import { FichaAnamneseResponseDto } from '../dtos/anamnese/ficha-anamnese-response.dto';
import { AlergiaService } from './alergia.service';
import { FichaPossuiAlergiasService } from './ficha-possui-alergias.service';

export class FichaAnamneseService {
    private fichaRepo = AppDataSource.getRepository(FichaAnamnese);
    
    // Injetamos os outros serviços em vez de repositórios
    private alergiaService = new AlergiaService();
    private ligacaoService = new FichaPossuiAlergiasService();

    async criar(dados: CreateFichaAnamneseDto): Promise<FichaAnamneseResponseDto> {
        
        // 1. Criar a ficha base
        const novaFicha = this.fichaRepo.create({
            id_utente: dados.id_utente,
            estadoTabagico: dados.estadoTabagico,
            antecedentes: dados.antecedentes,
            peso: dados.peso,
            altura: dados.altura
        });
        const fichaGuardada = await this.fichaRepo.save(novaFicha);

        // 2. Comunicar com os outros Services para tratar das alergias
        if (dados.alergias && dados.alergias.length > 0) {
            for (const nomeAlergia of dados.alergias) {
                // O AlergiaService trata de descobrir o ID
                const alergia = await this.alergiaService.encontrarOuCriar(nomeAlergia);
                
                // O LigacaoService trata de fazer a ponte
                await this.ligacaoService.criarLigacao(fichaGuardada.id_ficha, alergia.id_alergia);
            }
        }

        return {
            id_ficha: fichaGuardada.id_ficha,
            id_utente: fichaGuardada.id_utente,
            estadoTabagico: fichaGuardada.estadoTabagico,
            antecedentes: fichaGuardada.antecedentes,
            peso: fichaGuardada.peso,
            altura: fichaGuardada.altura,
            createdAt: fichaGuardada.createdAt,
            updatedAt: fichaGuardada.updatedAt
        };
    }
}