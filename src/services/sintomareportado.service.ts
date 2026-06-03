import { AppDataSource } from '../database/database';
import { SintomaReportado } from '../models/sintomareportado.entity';
import { CreateSintomaReportadoDto } from '../dtos/sintomareportado/create-sintomareportado.dto';
import { SintomaReportadoResponseDto } from '../dtos/sintomareportado/sintomareportado-response.dto';
import { LogAuditoriaService } from './logauditoria.service';
import { AlertaService } from './alerta.service';
import { UtenteService } from './utente.service';

export class SintomaReportadoService {
    private repo = AppDataSource.getRepository(SintomaReportado);
    private logService = new LogAuditoriaService();
    private alertaService = new AlertaService();
    private utenteService = new UtenteService();

    async reportarSintoma(dados: CreateSintomaReportadoDto, id_utilizador_que_reportou: number): Promise<SintomaReportadoResponseDto> {
        
        
        const utente = await this.utenteService.buscarPorId(dados.id_utente);
        if (!utente) {
            throw new Error("Utente não encontrado no sistema.");
        }

        
        const dataDoSintoma = dados.dataSintoma || new Date().toISOString();
        const novoSintoma = this.repo.create({
            ...dados,
            dataSintoma: dataDoSintoma 
        });

        const sintomaGuardado = await this.repo.save(novoSintoma);

       
        //gatilho 1  (RF14)
    
        if (dados.gravidade && Number(dados.gravidade) >= 4) {
            if (utente.id_medico) {
                await this.alertaService.gerarAlerta({
                    id_utente: utente.id_utente,
                    id_medico: utente.id_medico,
                    id_avaliacao_origem: sintomaGuardado.id_sintoma,
                    tipo: 'CRÍTICO - SINTOMA GRAVE',
                    prioridade: 'ALTA',
                    motivo: `Utente reportou sintoma de gravidade elevada (Nível ${dados.gravidade}): ${dados.descricao || dados.tipoSintoma}`
                });
            }
        }

        
        // GATILHO 2  (UC5)
        
        
        
        const historico = await this.repo.find({
            where: { id_utente: dados.id_utente },
            order: { dataSintoma: 'DESC' } 
        });

        const diasComSintomas = [...new Set(historico.map(s => {
            return s.dataSintoma ? new Date(s.dataSintoma).toISOString().split('T')[0] : null;
        }).filter(d => d !== null))];

       
        const hoje = new Date();
        const ontem = new Date(); ontem.setDate(hoje.getDate() - 1);
        const anteontem = new Date(); anteontem.setDate(hoje.getDate() - 2);

        const hojeStr = hoje.toISOString().split('T')[0];
        const ontemStr = ontem.toISOString().split('T')[0];
        const anteontemStr = anteontem.toISOString().split('T')[0];

      
        if (diasComSintomas.includes(hojeStr) && diasComSintomas.includes(ontemStr) && diasComSintomas.includes(anteontemStr)) {
            
            
            await this.repo.save(sintomaGuardado);

           
            if (utente.id_medico) {
                await this.alertaService.gerarAlerta({
                    id_utente: utente.id_utente,
                    id_medico: utente.id_medico,
                    id_avaliacao_origem: sintomaGuardado.id_sintoma,
                    tipo: 'AVISO - SINTOMAS PERSISTENTES',
                    prioridade: 'MÉDIA',
                    motivo: `O Utente reportou sintomas por 3 dias consecutivos (${anteontemStr} a ${hojeStr}). Requer atenção.`
                });
            }
        }

       
        await this.logService.registarLog({
            id_utilizador: id_utilizador_que_reportou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'SintomaReportado',
            id_registo_afetado: sintomaGuardado.id_sintoma,
            valorNovo: JSON.stringify({ descricao: dados.descricao, gravidade: dados.gravidade })
        });

        return this.toResponseDto(sintomaGuardado);
    }

    async listarPorUtente(id_utente: number): Promise<SintomaReportadoResponseDto[]> {
        // Corrigido de dataRegisto para dataSintoma
        const sintomas = await this.repo.find({ where: { id_utente: id_utente }, order: { dataSintoma: 'DESC' } });
        return sintomas.map(s => this.toResponseDto(s));
    }

    private toResponseDto(sintoma: SintomaReportado): SintomaReportadoResponseDto {
        return {
            id_sintoma: sintoma.id_sintoma,
            id_utente: sintoma.id_utente,
            tipoSintoma: sintoma.tipoSintoma,
            gravidade: sintoma.gravidade,
            dataSintoma: sintoma.dataSintoma,
            numSintoma: sintoma.numSintoma,
            descricao: sintoma.descricao,
            sintomaPresistente: sintoma.sintomaPresistente, 
            createdAt: sintoma.createdAt
        } as SintomaReportadoResponseDto;
    }
}