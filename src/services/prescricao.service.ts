import { AppDataSource } from '../database/database';
import { Prescricao } from '../models/prescricao.entity';
import { CreatePrescricaoDto } from '../dtos/prescricao/create-prescricao.dto';
import { PrescricaoResponseDto } from '../dtos/prescricao/prescricao-response.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class PrescricaoService {
    private repo = AppDataSource.getRepository(Prescricao);
    private logService = new LogAuditoriaService();

    /**
     * Cria a prescrição com validação anti-duplicados e gera auditoria
     */
    async criarPrescricao(dados: CreatePrescricaoDto, id_medico_que_prescreveu: number): Promise<PrescricaoResponseDto> {
        
        // 1. A TUA REGRA DE NEGÓCIO: Evitar prescrições duplicadas...
        // Mas adicionámos o id_utente para garantir que não bloqueamos o medicamento se for para pessoas diferentes!
        const jaExiste = await this.repo.findOneBy({
            medicamento: dados.medicamento,
            dose: dados.dose,
            medico_nome: dados.medico_nome,
            id_utente: dados.id_utente 
        });

        if (jaExiste) {
            throw new Error('Já existe uma prescrição igual registada no sistema para este utente.');
        }

        // 2. Criar a nova prescrição
        const nova = this.repo.create({
            ...dados,
            dataCriacao: new Date(),
        });

        const guardada = await this.repo.save(nova);

        // 3. A MINHA ARQUITETURA: Auditoria Obrigatória
        await this.logService.registarLog({
            id_utilizador: id_medico_que_prescreveu,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'Prescricao',
            id_registo_afetado: guardada.id_prescricao || (guardada as any).id,
            valorNovo: JSON.stringify({ medicamento: dados.medicamento, dose: dados.dose })
        });

        // 4. Devolve usando o DTO de forma limpa
        return this.toResponseDto(guardada);
    }

    /**
     * Lista todas as prescrições do sistema
     */
    async listarTodas(): Promise<PrescricaoResponseDto[]> {
        const prescricoes = await this.repo.find({ order: { dataCriacao: 'DESC' } });
        return prescricoes.map((prescricao) => this.toResponseDto(prescricao));
    }

    /**
     * Para listar o histórico no Dashboard do Utente e Médico (RF7)
     */
    async listarPorUtente(id_utente: number): Promise<PrescricaoResponseDto[]> {
        const prescricoes = await this.repo.find({
            where: { id_utente: id_utente },
            order: { dataCriacao: 'DESC' }
        });
        return prescricoes.map((prescricao) => this.toResponseDto(prescricao));
    }

    /**
     * Mapeamento final para o Frontend
     */
    private toResponseDto(prescricao: Prescricao): PrescricaoResponseDto {
        return {
            id_prescricao: prescricao.id_prescricao || (prescricao as any).id,
            id_utente: prescricao.id_utente,
            medicamento: prescricao.medicamento,
            dose: prescricao.dose,
            medico_nome: prescricao.medico_nome,
            dataCriacao: prescricao.dataCriacao // ATENÇÃO: Mantive a data porque o Dashboard precisa dela para o histórico!
        } as PrescricaoResponseDto;
    }
}