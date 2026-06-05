import { AppDataSource } from '../database/database';
import { Alerta } from '../models/alerta.entity';
import { CreateAlertaDto } from '../dtos/alerta/create-alerta.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { Utente } from '../models/utente.entity';
import { Utilizador } from '../models/utilizador.entity';

export class AlertaService {
    private repo = AppDataSource.getRepository(Alerta);
    private logService = new LogAuditoriaService();
    private utenteRepo = AppDataSource.getRepository(Utente);
private utilizadorRepo = AppDataSource.getRepository(Utilizador);



    /**
     * Chamado automaticamente pelo Motor CARAT (via Injeção de Dependências)
     */
    async gerarAlerta(dados: CreateAlertaDto): Promise<Alerta> {
        const novoAlerta = this.repo.create({
            id_utente: dados.id_utente,
            id_medico: dados.id_medico,
            id_avaliacao_origem: dados.id_avaliacao_origem ?? null, 
            tipo: dados.tipo,
            prioridade: dados.prioridade ?? 'MÉDIA',                
            motivo: dados.motivo ?? null                            
        });

        const alertaGuardado = await this.repo.save(novoAlerta);

        // Como foi gerado pelo sistema, podemos deixar o utilizador a null ou passar ID do utente
        await this.logService.registarLog({
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Alerta',
            id_registo_afetado: alertaGuardado.id_alerta,
            valorNovo: JSON.stringify(alertaGuardado)
        });

        return alertaGuardado;
    }

    /**
     * Endpoint do Dashboard do Médico: GET /doctors/:id/alerts
     */
   async listarPorMedico(id_medico: number): Promise<any[]> {
    const alertas = await this.repo.find({ where: { id_medico: id_medico } });
    
    // Cruza os dados para ir buscar o Nome do Utente
    const alertasComNome = await Promise.all(alertas.map(async (a) => {
        let nomeDoDoente = 'Utente Desconhecido';
        if (a.id_utente) {
            const utente = await this.utenteRepo.findOneBy({ id_utente: a.id_utente });
            if (utente) {
                const util = await this.utilizadorRepo.findOneBy({ id: utente.id_utilizador });
                if (util) nomeDoDoente = util.nome;
            }
        }
        return { ...a, nomeUtente: nomeDoDoente };
    }));
    
    return alertasComNome;
}

    /**
     * Médico altera o estado do alerta (ex: de PENDENTE para LIDO ou TRATADO)
     */
    async atualizarEstado(id_alerta: number, novoEstado: string, id_medico_que_alterou: number): Promise<Alerta> {
        const alerta = await this.repo.findOneBy({ id_alerta: id_alerta });
        if (!alerta) throw new Error("Alerta não encontrado.");

        const estadoAntigo = alerta.estado;
        alerta.estado = novoEstado;
        const alertaAtualizado = await this.repo.save(alerta);

        await this.logService.registarLog({
            id_utilizador: id_medico_que_alterou,
            tipoAcao: 'UPDATE',
            entidadeAfetada: 'Alerta',
            id_registo_afetado: id_alerta,
            valorAntigo: JSON.stringify({ estado: estadoAntigo }),
            valorNovo: JSON.stringify({ estado: alertaAtualizado.estado })
        });

        return alertaAtualizado;
    }
    async listarPorUtente(id_utente: number): Promise<any[]> {
        // Busca todos os alertas onde o id_utente corresponda
        return await this.repo.find({ 
            where: { id_utente: id_utente },
            order: { dataGeracao: 'DESC' } // Mostra os mais recentes primeiro
        });
    }
}