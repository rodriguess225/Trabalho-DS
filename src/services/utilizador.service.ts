import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';
import { CreateUtilizadorDto } from '../dtos/utilizador/create-utilizador.dto';
import { LogAuditoriaService } from './logauditoria.service';
import bcrypt from 'bcryptjs';

export class UtilizadorService {
    private repo = AppDataSource.getRepository(Utilizador);
    // Injeção de dependência do serviço de logs (1 Entidade = 1 Service)
    private logService = new LogAuditoriaService();

    /**
     * Cria um utilizador base (com password encriptada) e regista o log de auditoria
     */
    async criarUtilizador(dados: CreateUtilizadorDto, id_admin_que_criou?: number): Promise<Utilizador> {
        // 1. Verificar se o email já existe para evitar crash da Base de Dados
        const utilizadorExistente = await this.repo.findOneBy({ email: dados.email });
        if (utilizadorExistente) {
            throw new Error("Já existe um utilizador registado com este email.");
        }

        // 2. Encriptar a password antes de guardar
        const passwordHash = await bcrypt.hash(dados.password, 10);

        // 3. Criar a entidade
        const novoUtilizador = this.repo.create({
            nome: dados.nome,
            email: dados.email,
            password: passwordHash,
            perfil: dados.perfil,
            telemovel: dados.telemovel,
            ativo: true // Por defeito, contas novas vêm ativas
        });

        // 4. Guardar na BD
        const utilizadorGuardado = await this.repo.save(novoUtilizador);

        // 5. Registar a ação no Log de Auditoria
        await this.logService.registarLog({
            id_utilizador: id_admin_que_criou || utilizadorGuardado.id, // Se o Admin criou, fica o ID dele, se foi auto-registo, fica o ID do próprio
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Utilizador',
            id_registo_afetado: utilizadorGuardado.id,
            valorNovo: JSON.stringify({ email: utilizadorGuardado.email, perfil: utilizadorGuardado.perfil })
        });

        return utilizadorGuardado;
    }

    /**
     * Usado no Login (Auth Service) para encontrar o utilizador
     */
    async buscarPorEmail(email: string): Promise<Utilizador | null> {
        return await this.repo.findOneBy({ email: email });
    }

    /**
     * Usado para procurar um utilizador pelo seu ID
     */
    async buscarPorId(id: number): Promise<Utilizador | null> {
        return await this.repo.findOneBy({ id: id });
    }

    /**
     * Atualiza a data do último login (chamado pelo Login Controller)
     */
    async registarUltimoLogin(id: number): Promise<void> {
        const utilizador = await this.buscarPorId(id);
        if (utilizador) {
            utilizador.ultimoLogin = new Date().toISOString().split('T')[0]; // Guarda no formato YYYY-MM-DD
            await this.repo.save(utilizador);
        }
    }
}