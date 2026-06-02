import { AppDataSource } from '../database/database';
import { FichaAnamnese } from '../models/fichaanamnese.entity';
import { CreateFichaAnamneseDto } from '../dtos/anamnese/create-ficha-anamnese.dto';
import { FichaAnamneseResponseDto } from '../dtos/anamnese/ficha-anamnese-response.dto';

// Injeção de Dependências - A lógica correta de delegação
import { AlergiaService } from './alergia.service';
import { LogAuditoriaService } from './logauditoria.service';

export class FichaAnamneseService {
    private repo = AppDataSource.getRepository(FichaAnamnese);
    
    // Instanciar os serviços das tabelas adjacentes
    private alergiaService = new AlergiaService();
    private logService = new LogAuditoriaService();
    // NOTA: Se o teu colega criou o `LigacaoService`, podes descomentar a linha abaixo:
    // private ligacaoService = new LigacaoService(); 

    async criarFicha(dados: CreateFichaAnamneseDto, id_medico_que_criou: number): Promise<FichaAnamneseResponseDto> {
        
        // 1. Criar a ficha base (Sem as alergias, porque alergias é noutra tabela)
        const novaFicha = this.repo.create({
            id_utente: dados.id_utente,
            estadoTabagico: dados.estadoTabagico,
            antecedentes: dados.antecedentes,
            peso: dados.peso,
            altura: dados.altura
        });
        const fichaGuardada = await this.repo.save(novaFicha);

        // 2. Comunicar com os outros Services para tratar das alergias (A excelente lógica do teu amigo)
        if (dados.alergias && dados.alergias.length > 0) {
            for (const nomeAlergia of dados.alergias) {
                // O AlergiaService trata de descobrir o ID da alergia no catálogo
                const alergia = await this.alergiaService.encontrarOuCriar(nomeAlergia);
                
                // O LigacaoService (ou a entidade FichaPossuiAlergias) faz a ponte N:M
                // await this.ligacaoService.criarLigacao(fichaGuardada.id_ficha, alergia.id_alergia);
            }
        }

        // 3. Auditoria rigorosa
        await this.logService.registarLog({
            id_utilizador: id_medico_que_criou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'FichaAnamnese',
            id_registo_afetado: fichaGuardada.id_ficha || (fichaGuardada as any).id,
            valorNovo: JSON.stringify({ peso: dados.peso, estadoTabagico: dados.estadoTabagico })
        });

        return this.toResponseDto(fichaGuardada);
    }

    private toResponseDto(ficha: FichaAnamnese): FichaAnamneseResponseDto {
        return {
            id_ficha: ficha.id_ficha || (ficha as any).id,
            id_utente: ficha.id_utente,
            estadoTabagico: ficha.estadoTabagico,
            antecedentes: ficha.antecedentes,
            peso: ficha.peso,
            altura: ficha.altura
        } as FichaAnamneseResponseDto;
    }
}