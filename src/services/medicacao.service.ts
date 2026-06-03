import { AppDataSource } from '../database/database';
import { Medicacao } from '../models/medicacao.entity';
import { CreateMedicacaoDto } from '../dtos/medicacao/create-medicacao.dto';
import { MedicacaoResponseDto } from '../dtos/medicacao/medicacao-response.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class MedicacaoService {
    private repo = AppDataSource.getRepository(Medicacao);
    private logService = new LogAuditoriaService();

    async adicionarMedicacao(dados: CreateMedicacaoDto, id_utilizador: number): Promise<MedicacaoResponseDto> {
        const novaMedicacao = this.repo.create(dados);
        const guardada = await this.repo.save(novaMedicacao);

        await this.logService.registarLog({
            id_utilizador: id_utilizador,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Medicacao',
            id_registo_afetado: guardada.id_medicacao,
            valorNovo: JSON.stringify({ nomeMedicacao: dados.nomeMedicacao, dose: dados.dose })
        });

        return this.toResponseDto(guardada);
    }

    async listarPorUtente(id_utente: number): Promise<MedicacaoResponseDto[]> {
        const lista = await this.repo.find({ where: { id_utente: id_utente } });
        return lista.map(m => this.toResponseDto(m));
    }

    private toResponseDto(medicacao: Medicacao): MedicacaoResponseDto {
        return {
            id_medicacao: medicacao.id_medicacao,
            id_utente: medicacao.id_utente,
            id_intervencao_clinica: medicacao.id_intervencao_clinica,
            nomeMedicacao: medicacao.nomeMedicacao,
            dose: medicacao.dose,
            frequencia: medicacao.frequencia,
            dataPrescricao: medicacao.dataPrescricao || '',
            dataFinal: medicacao.dataFinal || null,
            createdAt: medicacao.createdAt
        } as MedicacaoResponseDto;
    }
}