import { AppDataSource } from '../database/database';
import { Administrador } from '../models/administrador.entity';
import { CreateAdministradorDto } from '../dtos/administrador/create-administrador.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class AdministradorService {
    private repo = AppDataSource.getRepository(Administrador);
    private logService = new LogAuditoriaService();

    /**
     * Associa um utilizador recém-criado à tabela de Administradores
     */
    async criarAdministrador(dados: CreateAdministradorDto, id_utilizador_que_criou?: number): Promise<Administrador> {
        // 1. Criar a entidade com base no ER
        const novoAdmin = this.repo.create({
            id_utilizador: dados.id_Utilizador
        });

        // 2. Guardar na BD
        const adminGuardado = await this.repo.save(novoAdmin);

        // 3. Registar o Log de Auditoria (Requisito Não Funcional do Relatório)
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_criou || adminGuardado.id_utilizador, // Quem executou a ação
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Administrador',
            id_registo_afetado: adminGuardado.id_administrador,
            valorNovo: JSON.stringify({ id_utilizador: adminGuardado.id_utilizador })
        });

        return adminGuardado;
    }

    /**
     * Retorna o perfil de administrador através do ID de utilizador associado
     */
    async buscarPorIdUtilizador(id_utilizador: number): Promise<Administrador | null> {
        return await this.repo.findOneBy({ id_utilizador: id_utilizador });
    }

    /**
     * Lista todos os administradores registados
     */
    async listarAdministradores(): Promise<Administrador[]> {
        return await this.repo.find();
    }
}