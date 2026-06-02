import { AppDataSource } from '../database/database';
import { SintomaReportado } from '../models/sintomareportado.entity';
import { CreateSintomaReportadoDto } from '../dtos/sintomareportado/create-sintomareportado.dto';
import { SintomaReportadoResponseDto } from '../dtos/sintomareportado/sintomareportado-response.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { AlertaService } from './alerta.service';
import { UtenteService } from './utente.service';

export class SintomaReportadoService {
    private repo = AppDataSource.getRepository(SintomaReportado);
    private logService = new LogAuditoriaService();
    private alertaService = new AlertaService();
    private utenteService = new UtenteService();

    async reportarSintoma(dados: CreateSintomaReportadoDto, id_utilizador_que_reportou: number): Promise<SintomaReportadoResponseDto> {
        const novoSintoma = this.repo.create({
            ...dados,
            dataRegisto: dados.dataRegisto || new Date().toISOString()
        });

        const sintomaGuardado = await this.repo.save(novoSintoma);

        // LÓGICA CLÍNICA: Se o sintoma for muito grave, avisa o médico
        if (dados.gravidade === 'ALTA' || dados.gravidade === 'GRAVE') {
            const utente = await this.utenteService.buscarPorId(dados.id_utente);
            if (utente && utente.id_medico) {
                await this.alertaService.gerarAlerta({
                    id_utente: utente.id_utente,
                    id_medico: utente.id_medico,
                    id_avaliacao_origem: sintomaGuardado.id_sintoma || (sintomaGuardado as any).id,
                    tipo: 'Sintoma Crítico Reportado',
                    prioridade: 'ALTA',
                    motivo: `Utente reportou sintoma grave: ${dados.descricao}`
                });
            }
        }

        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_reportou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'SintomaReportado',
            id_registo_afetado: sintomaGuardado.id_sintoma || (sintomaGuardado as any).id,
            valorNovo: JSON.stringify({ descricao: dados.descricao, gravidade: dados.gravidade })
        });

        return this.toResponseDto(sintomaGuardado);
    }

    async listarPorUtente(id_utente: number): Promise<SintomaReportadoResponseDto[]> {
        const sintomas = await this.repo.find({ where: { id_utente: id_utente }, order: { dataRegisto: 'DESC' } });
        return sintomas.map(s => this.toResponseDto(s));
    }

    private toResponseDto(sintoma: SintomaReportado): SintomaReportadoResponseDto {
        return {
            id_sintoma: sintoma.id_sintoma || (sintoma as any).id,
            id_utente: sintoma.id_utente,
            descricao: sintoma.descricao,
            gravidade: sintoma.gravidade,
            dataRegisto: sintoma.dataRegisto
        } as SintomaReportadoResponseDto;
    }
}