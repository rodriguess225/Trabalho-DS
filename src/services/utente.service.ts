import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { CreateUtenteDto } from '../dtos/utente/create-utente.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class UtenteService {
    private repo = AppDataSource.getRepository(Utente);
    private logService = new LogAuditoriaService();

    /**
     * Cria os dados demográficos e clínicos do Utente na base de dados
     */
    async criarUtente(dados: CreateUtenteDto, id_utilizador_que_criou: number): Promise<Utente> {
        // 1. Mapear EXATAMENTE com as colunas definidas no utente.entity.ts
        const novoUtente = this.repo.create({
            id_utilizador: dados.id_utilizador,
            id_medico: dados.id_medico, // Pode ser undefined no início
            dataNascimento: dados.dataNascimento,
            morada: dados.morada,
            genero: dados.genero,
            numSaude: dados.numSaude,
            nif: dados.nif
        });

        // 2. Gravar o Utente
        const utenteGuardado = await this.repo.save(novoUtente);

        // 3. Auditoria
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_criou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Utente',
            id_registo_afetado: utenteGuardado.id_utente,
            valorNovo: JSON.stringify(utenteGuardado)
        });

        return utenteGuardado;
    }

    /**
     * Associa (ou atualiza) o médico de família do utente. 
     * Implementa as regras de negócio de acompanhamento do vosso Relatório.
     */
    async associarMedico(id_utente: number, id_medico: number, id_admin_ou_medico_que_alterou: number): Promise<Utente> {
        const utente = await this.repo.findOneBy({ id_utente: id_utente });
        
        if (!utente) {
            throw new Error("Utente não encontrado no sistema.");
        }

        const valorAntigo = utente.id_medico;
        utente.id_medico = id_medico;
        
        const utenteAtualizado = await this.repo.save(utente);

        // Auditoria da transição de responsabilidade clínica
        await this.logService.registarLog({
            id_utilizador: id_admin_ou_medico_que_alterou,
            tipoAcao: 'UPDATE',
            entidadeAfetada: 'Utente',
            id_registo_afetado: utenteAtualizado.id_utente,
            valorAntigo: JSON.stringify({ id_medico: valorAntigo }),
            valorNovo: JSON.stringify({ id_medico: utenteAtualizado.id_medico })
        });

        return utenteAtualizado;
    }

    /**
     * Lista utentes. Se for passado o id_medico, serve para o "Dashboard do Médico" 
     * ver apenas os seus próprios doentes.
     */
    async listarUtentes(id_medico?: number): Promise<Utente[]> {
        if (id_medico) {
            return await this.repo.find({ where: { id_medico: id_medico } });
        }
        return await this.repo.find();
    }

    /**
     * Localiza a ficha do Utente usando o ID de Utilizador dele
     */
    async buscarPorIdUtilizador(id_utilizador: number): Promise<Utente | null> {
        return await this.repo.findOneBy({ id_utilizador: id_utilizador });
    }

    /**
     * Procura um utente pelo seu ID de Utente (usado muito nas avaliações CARAT e Exames)
     */
    async buscarPorId(id_utente: number): Promise<Utente | null> {
        return await this.repo.findOneBy({ id_utente: id_utente });
    }
}