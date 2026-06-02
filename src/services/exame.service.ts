import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';
import { ExameResponseDto } from '../dtos/exame/exame-response.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class ExameService {
    private repo = AppDataSource.getRepository(Exame);
    private logService = new LogAuditoriaService();

    /**
     * Cria um exame com validações fortes e auditoria
     */
    async criarExame(dados: CreateExameDto, id_medico_que_solicitou: number): Promise<ExameResponseDto> {
        
        // 1. A TUA VALIDAÇÃO: Código exato de 4 caracteres
        if (dados.codigo && dados.codigo.length !== 4) {
            throw new Error("O código do exame deve ter exatamente 4 caracteres.");
        }

        // 2. A TUA VALIDAÇÃO: Evitar Duplicados (verifica se já existe para este utente e médico)
        const jaExiste = await this.repo.findOneBy({
            tipoExame: dados.tipoExame, // ou dados.nome consoante a tua entidade
            codigo: dados.codigo,
            id_utente: dados.id_utente
        });
        
        if (jaExiste) {
            throw new Error("Já existe um exame igual registado para este utente.");
        }

        // 3. Criar a Entidade
        const novoExame = this.repo.create({
            ...dados,
            dataSolicitacao: dados.dataSolicitacao || new Date().toISOString().split('T')[0]
        });

        const exameGuardado = await this.repo.save(novoExame);

        // 4. A MINHA ARQUITETURA: Registo Obrigatório na Auditoria
        await this.logService.registarLog({
            id_utilizador: id_medico_que_solicitou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Exame',
            id_registo_afetado: exameGuardado.id_exame || (exameGuardado as any).id,
            valorNovo: JSON.stringify({ tipoExame: dados.tipoExame, codigo: dados.codigo })
        });

        // 5. Devolver limpo usando o padrão DTO
        return this.toResponseDto(exameGuardado);
    }

    /**
     * Lista todos os exames (O teu listar original, mas devolve DTOs)
     */
    async listarExames(): Promise<ExameResponseDto[]> {
        const exames = await this.repo.find({ order: { dataSolicitacao: 'DESC' } });
        return exames.map(exame => this.toResponseDto(exame));
    }

    /**
     * Lista os exames específicos de um doente (Para o Dashboard)
     */
    async listarPorUtente(id_utente: number): Promise<ExameResponseDto[]> {
        const exames = await this.repo.find({ 
            where: { id_utente: id_utente },
            order: { dataSolicitacao: 'DESC' }
        });
        return exames.map(exame => this.toResponseDto(exame));
    }

    /**
     * Formatador para a saída
     */
    private toResponseDto(exame: Exame): ExameResponseDto {
        return {
            id_exame: exame.id_exame || (exame as any).id,
            id_utente: exame.id_utente,
            tipoExame: exame.tipoExame, // ou exame.nome
            codigo: exame.codigo,
            medico_nome: exame.medico_nome,
            dataSolicitacao: exame.dataSolicitacao
        } as ExameResponseDto;
    }
}