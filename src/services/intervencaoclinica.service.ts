import { AppDataSource } from '../database/database';
import { IntervencaoClinica } from '../models/intervencaoclinica.entity';
import { CreateIntervencaoDto } from '../dtos/intervencaoClinica/create-intervencao.dto';
import { IntervencaoResponseDto } from '../dtos/intervencaoClinica/intervencao-response.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { AlertaService } from './alerta.service';

export class IntervencaoClinicaService {
    private repo = AppDataSource.getRepository(IntervencaoClinica);
    private logService = new LogAuditoriaService();
    private alertaService = new AlertaService();
    
    async registarIntervencao(dados: CreateIntervencaoDto, id_medico_que_registou: number): Promise<IntervencaoResponseDto> {
        
        // Criamos o objeto à parte para o TypeORM não se confundir
        const dadosParaCriar: any = {
            id_utente: dados.id_utente,
            id_medico: dados.id_medico,
            id_alerta: dados.id_alerta ?? null,
            notasMedicas: dados.notasMedicas ?? null,
            acaoTomada: dados.acoesTomadas ?? null, 
            dataRegisto: new Date().toISOString()
        };

        const nova = this.repo.create(dadosParaCriar); 
        
        // CORREÇÃO AQUI: as unknown as IntervencaoClinica
        const guardada = (await this.repo.save(nova)) as unknown as IntervencaoClinica;
             
        if (dados.id_alerta) {
              await this.alertaService.atualizarEstado(dados.id_alerta, 'FECHADO', id_medico_que_registou);
        }

        await this.logService.registarLog({
            id_utilizador: id_medico_que_registou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'IntervencaoClinica',
            id_registo_afetado: guardada.id_intervencao,
            valorNovo: JSON.stringify({ notasMedicas: dados.notasMedicas }) 
        });

        return this.toResponseDto(guardada);
    }
    private toResponseDto(intervencao: IntervencaoClinica): IntervencaoResponseDto {
        return {
            id_intervencao: intervencao.id_intervencao,
            id_utente: intervencao.id_utente,
            id_medico: intervencao.id_medico,
            notasMedicas: intervencao.notasMedicas || '',
            diagnostico: null,
            dataIntervencao: intervencao.dataRegisto 
        } as any;
    }
    // Adiciona este método dentro da classe IntervencaoService
    async buscarPorUtente(id_utente: number): Promise<IntervencaoClinica[]> {
        return await this.repo.find({
            where: { id_utente: id_utente },
            order: { dataRegisto: 'DESC' } // Mostra as notas mais recentes primeiro
        });
    }
}