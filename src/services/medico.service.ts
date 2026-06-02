import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { CreateMedicoDto } from '../dtos/medico/create-medico.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class MedicoService {
    private repo = AppDataSource.getRepository(Medico);
    private logService = new LogAuditoriaService();

    /**
     * Cria o perfil profissional do Médico e guarda na tabela 'medicos'
     */
    async criarMedico(dados: CreateMedicoDto, id_admin_que_criou: number): Promise<Medico> {
        // 1. Mapeamento direto para a tabela baseando na Entidade
        const novoMedico = this.repo.create({
            id_utilizador: dados.id_utilizador,
            especialidade: dados.especialidade
            // Nota: Se no ER tiverem adicionado 'numCedula' ou 'instituicao', deves adicionar aqui também, ex:
            // numCedula: dados.numCedula
        });

        // 2. Guardar na BD
        const medicoGuardado = await this.repo.save(novoMedico);

        // 3. Auditoria obrigatória
        await this.logService.registarLog({
            id_utilizador: id_admin_que_criou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Medico',
            id_registo_afetado: medicoGuardado.id_medico,
            valorNovo: JSON.stringify(medicoGuardado)
        });

        return medicoGuardado;
    }

    /**
     * Lista todos os médicos. Fundamental para a interface onde o Utente ou Admin escolhem um médico.
     */
    async listarMedicos(): Promise<Medico[]> {
        return await this.repo.find();
    }

    /**
     * Retorna a ficha de médico através do ID de utilizador (Usado durante o Login para saber quem é)
     */
    async buscarPorIdUtilizador(id_utilizador: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_utilizador: id_utilizador });
    }

    /**
     * Busca os detalhes de um médico específico (para o Dashboard do Utente ver o contacto do médico)
     */
    async buscarPorId(id_medico: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_medico: id_medico });
    }
}