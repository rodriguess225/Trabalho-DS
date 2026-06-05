import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { Utente } from '../models/utente.entity';
import { CreateMedicoDto } from '../dtos/medico/create-medico.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { Utilizador } from '../models/utilizador.entity';

export class MedicoService {
    private repo = AppDataSource.getRepository(Medico);
    private logService = new LogAuditoriaService();
    private utenteRepo = AppDataSource.getRepository(Utente);
    private utilizadorRepo = AppDataSource.getRepository(Utilizador);

    /**
     * Cria o perfil profissional do Médico e guarda na tabela 'medicos'
     */
    async criarMedico(dados: CreateMedicoDto, id_admin_que_criou: number): Promise<Medico> {
        
        // 1. O nosso truque do 'any' para contornar o exactOptionalPropertyTypes
        const dadosParaCriar: any = {
            id_utilizador: dados.id_utilizador,
            especialidade: dados.especialidade ?? null,
            numCedula: (dados as any).numCedula ?? null 
        };

        const novoMedico = this.repo.create(dadosParaCriar);

        // 2. O duplo cast para garantir ao TypeScript que não é um Array
        const medicoGuardado = (await this.repo.save(novoMedico)) as unknown as Medico;

        // 3. Auditoria obrigatória (Mantemos o JSON.stringify porque o log exige string)
        await this.logService.registarLog({
            id_utilizador: id_admin_que_criou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Medico',
            id_registo_afetado: medicoGuardado.id_medico,
            valorNovo: JSON.stringify(medicoGuardado)
        });

        return medicoGuardado;
    }

  
    async listarMedicos(): Promise<any[]> {
        const medicos = await this.repo.find();
        
        // Faz a junção manual com os dados do Utilizador (Nome, Email)
        const medicosComUtilizador = await Promise.all(medicos.map(async (m) => {
            const utilizador = await this.utilizadorRepo.findOneBy({ id: m.id_utilizador });
            if (utilizador) {
                const { password, ...dadosSeguros } = utilizador;
                return { ...m, utilizador: dadosSeguros };
            }
            return m;
        }));
        
        return medicosComUtilizador;
    }

  
    async buscarPorIdUtilizador(id_utilizador: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_utilizador: id_utilizador });
    }

    
    async buscarPorId(id_medico: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_medico: id_medico });
    }

    // --- CORREÇÃO DO PASSO 2: Agora puxa o nome do Utente ---
    async listarUtentesDoMedico(id_medico: number): Promise<any[]> {
        // 1. Busca os utentes do médico na tabela 'Utente'
        const utentes = await this.utenteRepo.find({ 
            where: { id_medico: id_medico } 
        });

        // 2. Faz o "Join" manual para ir buscar o Nome e Email à tabela 'Utilizador'
        const utentesComNome = await Promise.all(utentes.map(async (u) => {
            const utilizador = await this.utilizadorRepo.findOneBy({ id: u.id_utilizador });
            if (utilizador) {
                const { password, ...dadosSeguros } = utilizador;
                return { ...u, utilizador: dadosSeguros };
            }
            return u;
        }));
        
        return utentesComNome;
    }
    // Apagar Médico e a sua conta de Utilizador
    async apagarMedico(id_medico: number): Promise<void> {
        const medico = await this.repo.findOneBy({ id_medico });
        if (!medico) throw new Error("Médico não encontrado no sistema.");

        const utilizador = await this.utilizadorRepo.findOneBy({ id: medico.id_utilizador });
        
        // Remove primeiro o perfil médico, depois a conta de login
        await this.repo.remove(medico);
        if (utilizador) {
            await this.utilizadorRepo.remove(utilizador);
        }
    }

    // Atualizar dados do Médico
    async atualizarMedico(id_medico: number, dados: any): Promise<Medico> {
        const medico = await this.repo.findOneBy({ id_medico });
        if(!medico) throw new Error("Médico não encontrado.");

        if (dados.especialidade) medico.especialidade = dados.especialidade;
        if (dados.numCedula) medico.numCedula = dados.numCedula;

        return await this.repo.save(medico);
    }
}