import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';
import { ExameResponseDto } from '../dtos/exame/exame-response.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class ExameService {
    private repo = AppDataSource.getRepository(Exame);
    private logService = new LogAuditoriaService();

   async criarExame(dados: CreateExameDto, id_medico_que_solicitou: number): Promise<ExameResponseDto> {
        
        const jaExiste = await this.repo.findOneBy({
            tipoExame: dados.tipoExame,
            id_utente: dados.id_utente,
            id_intervencao_clinica: dados.id_intervencao_clinica
        });
        
        if (jaExiste) {
            throw new Error("Já existe um exame igual registado para este utente.");
        }

        // 1. Isolar num objeto 'any' para o TypeScript não bloquear no 'create'
        const dadosParaCriar: any = {
            id_utente: dados.id_utente,
            tipoExame: dados.tipoExame,
            id_intervencao_clinica: dados.id_intervencao_clinica,
            dataSolicitacao: dados.dataSolicitacao || new Date().toISOString().split('T')[0]
        };

        const novoExame = this.repo.create(dadosParaCriar);

        // 2. Duplo cast para forçar o TypeScript a reconhecer o objeto único e os seus campos
        const exameGuardado = (await this.repo.save(novoExame)) as unknown as Exame;

        await this.logService.registarLog({
            id_utilizador: id_medico_que_solicitou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Exame',
            id_registo_afetado: exameGuardado.id_exame,
            valorNovo: JSON.stringify({ tipoExame: dados.tipoExame })
        });

        return this.toResponseDto(exameGuardado);
    }

    async listarExames(): Promise<ExameResponseDto[]> {
        const exames = await this.repo.find({ order: { dataSolicitacao: 'DESC' } });
        return exames.map(exame => this.toResponseDto(exame));
    }

    async listarPorUtente(id_utente: number): Promise<ExameResponseDto[]> {
        const exames = await this.repo.find({ 
            where: { id_utente: id_utente },
            order: { dataSolicitacao: 'DESC' }
        });
        return exames.map(exame => this.toResponseDto(exame));
    }

    private toResponseDto(exame: Exame): ExameResponseDto {
        return {
            id_exame: exame.id_exame,
            id_utente: exame.id_utente,
            id_intervencao_clinica: exame.id_intervencao_clinica ?? null,
            tipoExame: exame.tipoExame,
            dataSolicitacao: exame.dataSolicitacao,
            resultado: exame.resultado ?? null,
            concluido: exame.concluido
        } as ExameResponseDto;
    }
}