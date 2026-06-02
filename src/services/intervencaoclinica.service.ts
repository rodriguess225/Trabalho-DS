import { AppDataSource } from '../database/database';
import { IntervencaoClinica } from '../models/intervencaoclinica.entity';
import { CreateIntervencaoDto } from '../dtos/intervencaoClinica/create-intervencao.dto';
import { IntervencaoResponseDto } from '../dtos/intervencaoClinica/intervencao-response.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class IntervencaoClinicaService {
    private repo = AppDataSource.getRepository(IntervencaoClinica);
    private logService = new LogAuditoriaService();

    async registarIntervencao(dados: CreateIntervencaoDto, id_medico_que_registou: number): Promise<IntervencaoResponseDto> {
        const nova = this.repo.create({
            ...dados,
            dataIntervencao: dados.dataIntervencao || new Date().toISOString()
        });
        const guardada = await this.repo.save(nova);

        await this.logService.registarLog({
            id_utilizador: id_medico_que_registou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'IntervencaoClinica',
            id_registo_afetado: guardada.id_intervencao || (guardada as any).id,
            valorNovo: JSON.stringify({ tipo: dados.tipo, observacoes: dados.observacoes })
        });

        return this.toResponseDto(guardada);
    }

    private toResponseDto(intervencao: IntervencaoClinica): IntervencaoResponseDto {
        return {
            id_intervencao: intervencao.id_intervencao || (intervencao as any).id,
            id_utente: intervencao.id_utente,
            id_medico: intervencao.id_medico,
            tipo: intervencao.tipo,
            dataIntervencao: intervencao.dataIntervencao,
            observacoes: intervencao.observacoes
        } as IntervencaoResponseDto;
    }
}