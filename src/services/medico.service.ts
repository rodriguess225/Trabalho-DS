import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { Utente } from '../models/utente.entity';
import { CreateMedicoDto } from '../dtos/medico/create-medico.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class MedicoService {
    private repo = AppDataSource.getRepository(Medico);
    private logService = new LogAuditoriaService();
    private utenteRepo = AppDataSource.getRepository(Utente);

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

  
    async listarMedicos(): Promise<Medico[]> {
        return await this.repo.find();
    }

  
    async buscarPorIdUtilizador(id_utilizador: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_utilizador: id_utilizador });
    }

    
    async buscarPorId(id_medico: number): Promise<Medico | null> {
        return await this.repo.findOneBy({ id_medico: id_medico });
    }

async listarUtentesDoMedico(id_medico: number) {
    return await this.utenteRepo.find({ 
        where: { id_medico: id_medico } 
    });
}
}