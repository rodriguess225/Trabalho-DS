import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { CreateUtenteDto } from '../dtos/utente/create-utente.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { Medico } from '../models/medico.entity';
import { Utilizador } from '../models/utilizador.entity';

export class UtenteService {
    private repo = AppDataSource.getRepository(Utente);
    private logService = new LogAuditoriaService();
    private medicoRepo = AppDataSource.getRepository(Medico);
    private utilizadorRepo = AppDataSource.getRepository(Utilizador);

    /**
     * Cria os dados demográficos e clínicos do Utente na base de dados
     */
    async criarUtente(dados: CreateUtenteDto, id_utilizador_que_criou: number): Promise<Utente> {
        
        // --- 1. LÓGICA DE ATRIBUIÇÃO ALEATÓRIA DO MÉDICO ---
        let id_medico_final = dados.id_medico;

        // Se o utente não escolheu um médico (vem vazio), sorteamos um!
        if (!id_medico_final) {
            const medicos = await this.medicoRepo.find();
            
            if (medicos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * medicos.length);
                // Apanha o id_medico do médico sorteado
                id_medico_final = medicos[indiceAleatorio]?.id_medico; 
            } else {
                throw new Error("Não é possível concluir o registo: Não existem médicos no sistema.");
            }
        }
        

        // 2. Driblar a restrição do TypeScript lidando com os potenciais undefined
        const dadosParaCriar: any = {
            id_utilizador: dados.id_utilizador,
            id_medico: id_medico_final, // <--- UTILIZA O MÉDICO SORTEADO AQUI
            dataNascimento: dados.dataNascimento ?? null,
            morada: dados.morada ?? null,
            genero: dados.genero ?? null,
            numSaude: dados.numSaude ?? null,
            nif: dados.nif ?? null
        };

        const novoUtente = this.repo.create(dadosParaCriar);

        // 3. O cast mágico para o TypeORM perceber que é apenas 1 objeto
        const utenteGuardado = (await this.repo.save(novoUtente)) as unknown as Utente;

        // 4. Auditoria
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_criou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Utente',
            id_registo_afetado: utenteGuardado.id_utente,
            valorNovo: JSON.stringify(utenteGuardado)
        });

        return utenteGuardado;
    }

    
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