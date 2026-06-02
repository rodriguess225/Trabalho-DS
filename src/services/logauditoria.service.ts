import { AppDataSource } from '../database/database';
import { LogAuditoria } from '../models/logauditoria.entity';
import { CreateLogAuditoriaDto } from '../dtos/logauditoria/create-logauditoria.dto';

export class LogAuditoriaService {
    private repo = AppDataSource.getRepository(LogAuditoria);

    /**
     * Regista uma nova ação no sistema (CREATE, UPDATE, DELETE, LOGIN)
     */
    async registarLog(dados: CreateLogAuditoriaDto): Promise<LogAuditoria> {
        const novoLog = this.repo.create({
            id_utilizador: dados.id_utilizador,
            tipoAcao: dados.tipoAcao,
            entidadeAfetada: dados.entidadeAfetada,
            id_registo_afetado: dados.id_registo_afetado,
            dataHora: dados.dataHora || new Date().toISOString(), // Se não vier data, assume agora
            valorAntigo: dados.valorAntigo ? JSON.stringify(dados.valorAntigo) : undefined,
            valorNovo: dados.valorNovo ? JSON.stringify(dados.valorNovo) : undefined
        });

        return await this.repo.save(novoLog);
    }

    /**
     * Permite ao Administrador ver o histórico de logs
     */
    async listarLogs(): Promise<LogAuditoria[]> {
        return await this.repo.find({
            order: { createdAt: 'DESC' } // Mostra os mais recentes primeiro
        });
    }

    /**
     * Permite ver o histórico de um utilizador específico (ex: o que o Médico X andou a fazer)
     */
    async listarLogsPorUtilizador(id_utilizador: number): Promise<LogAuditoria[]> {
        return await this.repo.find({
            where: { id_utilizador: id_utilizador },
            order: { createdAt: 'DESC' }
        });
    }
}