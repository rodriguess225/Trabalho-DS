import { AppDataSource } from '../database/database';
import { LogAuditoria } from '../models/logauditoria.entity';
import { CreateLogAuditoriaDto } from '../dtos/logauditoria/create-logauditoria.dto';

export class LogAuditoriaService {
    private repo = AppDataSource.getRepository(LogAuditoria);

    async registarLog(dados: CreateLogAuditoriaDto): Promise<LogAuditoria> {
        
        // 1. Driblar o TypeScript isolando os dados num 'any' e convertendo undefined em null
        const dadosParaCriar: any = {
            id_utilizador: dados.id_utilizador ?? null,
            tipoAcao: dados.tipoAcao,
            entidadeAfetada: dados.entidadeAfetada,
            id_registo_afetado: dados.id_registo_afetado ?? null,
            dataHora: dados.dataHora || new Date().toISOString(), // Mantem a data como string como pede a BD
            valorAntigo: dados.valorAntigo ?? null,
            valorNovo: dados.valorNovo ?? null
        };

        const novoLog = this.repo.create(dadosParaCriar);

        // 2. Duplo cast para evitar o problema de ele achar que vai devolver um Array
        const logGuardado = (await this.repo.save(novoLog)) as unknown as LogAuditoria;

        return logGuardado;
    }

    async listarLogs(): Promise<LogAuditoria[]> {
        return await this.repo.find({
            order: { dataHora: 'DESC' } 
        });
    }

    async listarLogsPorUtilizador(id_utilizador: number): Promise<LogAuditoria[]> {
        return await this.repo.find({
            where: { id_utilizador: id_utilizador },
            order: { dataHora: 'DESC' }
        });
    }
}