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
        let id_medico_final: number | undefined | null = dados.id_medico;
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
        const utentes = id_medico 
            ? await this.repo.find({ where: { id_medico: id_medico } })
            : await this.repo.find();
            
        const utentesComUtilizador = await Promise.all(utentes.map(async (u) => {
            const utilizador = await this.utilizadorRepo.findOneBy({ id: u.id_utilizador });
            if (utilizador) {
                const { password, ...dadosSeguros } = utilizador; 
                return { ...u, utilizador: dadosSeguros } as any;
            }
            return u;
        }));
        
        return utentesComUtilizador;
    }

    /**
     * Localiza a ficha do Utente usando o ID de Utilizador dele
     */
    async buscarPorIdUtilizador(id_utilizador: number): Promise<any | null> {
        const utente = await this.repo.findOneBy({ id_utilizador: id_utilizador });
        if (!utente) return null;

        const utilizador = await this.utilizadorRepo.findOneBy({ id: id_utilizador });

        return {
            ...utente,
            utilizador: utilizador ? { telemovel: utilizador.telemovel, nome: utilizador.nome } : null
        };
    }

    /**
     * Procura um utente pelo seu ID de Utente 
     */
    async buscarPorId(id_utente: number): Promise<Utente | null> {
        return await this.repo.findOneBy({ id_utente: id_utente });
        relations: ['utilizador']
    }

    async atualizarDadosPerfil(id_utente: number, dados: any) {
        // 1. Encontra o utente na base de dados
        const utente = await this.repo.findOneBy({ id_utente: id_utente });
        if (!utente) throw new Error("Utente não encontrado");

        // 2. Encontra o utilizador associado a este utente 
        const utilizador = await this.utilizadorRepo.findOneBy({ id: utente.id_utilizador });
        if (!utilizador) throw new Error("Utilizador não encontrado");

        // 3. Atualiza os campos que pertencem à tabela Utente
        if (dados.morada) utente.morada = dados.morada;
        if (dados.numSaude) utente.numSaude = dados.numSaude;
        if (dados.nif) utente.nif = dados.nif;
        if (dados.genero) utente.genero = dados.genero;
        if (dados.dataNascimento) utente.dataNascimento = dados.dataNascimento;

        // 4. Atualiza o telemóvel na tabela Utilizador
        if (dados.contacto !== undefined) utilizador.telemovel = dados.contacto;

        // 5. Guarda ambas as alterações na base de dados
        await this.utilizadorRepo.save(utilizador); // Grava o telemóvel na tabela utilizadores
        return await this.repo.save(utente);        // Grava o resto na tabela utentes
    }


    async apagarUtente(id_utente: number): Promise<void> {
        const utente = await this.repo.findOneBy({ id_utente });
        if (!utente) throw new Error("Utente não encontrado no sistema.");

        // Procura o utilizador associado à conta de login
        const utilizador = await this.utilizadorRepo.findOneBy({ id: utente.id_utilizador });
        
        // Remove primeiro o perfil clínico, depois a conta de login
        await this.repo.remove(utente);
        if (utilizador) {
            await this.utilizadorRepo.remove(utilizador);
        }
    }
}