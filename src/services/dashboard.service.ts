import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { AvaliacaoCARAT } from '../models/avaliacao-carat.entity';
import { Alerta } from '../models/alerta.entity';
import { Exame } from '../models/exame.entity';
import { Medicacao } from '../models/medicacao.entity';
import { SintomaReportado } from '../models/sintomareportado.entity';
import { IntervencaoClinica } from '../models/intervencaoclinica.entity';
import { LogAuditoriaService } from './logauditoria.service';
import { Utilizador } from '../models/utilizador.entity';
import { getConditionsFromFhir } from './fhir.service'; 
import { getPatientsFromFhir } from './fhir.service';


export class DashboardService {
    // 1. Ligar aos Repositórios de todos os Módulos
    private utenteRepo = AppDataSource.getRepository(Utente);
    private caratRepo = AppDataSource.getRepository(AvaliacaoCARAT);
    private alertaRepo = AppDataSource.getRepository(Alerta);
    private exameRepo = AppDataSource.getRepository(Exame);
    private medicacaoRepo = AppDataSource.getRepository(Medicacao);
    private sintomaRepo = AppDataSource.getRepository(SintomaReportado);
    private intervencaoRepo = AppDataSource.getRepository(IntervencaoClinica);
    private utilizadorRepo = AppDataSource.getRepository(Utilizador);
    
    private logService = new LogAuditoriaService();

    /**
     * Retorna uma visão consolidada de todo o histórico do utente (UC7)
     */
    async obterHistoricoCompletoUtente(id_utente: number, id_medico_que_consulta: number): Promise<any> {
        
        // 2. Verificar se o utente existe
        const utente = await this.utenteRepo.findOne({ where: { id_utente: id_utente } });
        if (!utente) {
            throw new Error("Utente não encontrado no sistema.");
        }

        const utilizador = await this.utilizadorRepo.findOne({ where: { id: utente.id_utilizador } });
        
     
        // LÓGICA FHIR: Função isolada para o processo em paralelo
        
        const buscarDadosFHIR = async () => {
            if (!utente.numSaude) return [];
            
            try {
                const pacientesFhir = await getPatientsFromFhir(utente.numSaude);
                
                // 1. Verificar se o array veio vazio ou indefinido
                if (!pacientesFhir || pacientesFhir.length === 0) return [];
                
                // 2. Isolar o primeiro paciente para o TypeScript ter certeza absoluta do tipo
                const primeiroPaciente = pacientesFhir[0];
                
                // 3. Garantir que o paciente e o seu ID não são nulos/undefined
                if (!primeiroPaciente || !primeiroPaciente.id) return [];
                
                // 4. Agora o TypeScript já sabe que fhirId é uma string válida (100% seguro)
                const fhirId: string = primeiroPaciente.id;
                
                return await getConditionsFromFhir(fhirId);

            } catch (error: any) { 
                console.error("Aviso: Falha ao comunicar com o servidor FHIR. A ignorar.", error.message);
                return []; 
            }
        };
        
        
        
        
        const [
           avaliacoesCarat,
           alertas,
           exames,
           medicacoes,
           sintomas,
           intervencoes,
           diagnosticos_externos_fhir // <-- O resultado do FHIR cai aqui!
        ] = await Promise.all([
           this.caratRepo.find({ where: { utenteId: id_utente }, order: { dataAvaliacao: 'DESC' } }),
           this.alertaRepo.find({ where: { id_utente: id_utente }, order: { createdAt: 'DESC' } }),
           this.exameRepo.find({ where: { id_utente: id_utente } }),
           this.medicacaoRepo.find({ where: { id_utente: id_utente } }),
           this.sintomaRepo.find({ where: { id_utente: id_utente } }),
           this.intervencaoRepo.find({ where: { id_utente: id_utente } }),
           buscarDadosFHIR() // <-- A chamada ao FHIR arranca em simultâneo com a BD!
       ]);

        // 4. Registar Log de Auditoria (Saber que o médico X visualizou a ficha do utente Y)
        await this.logService.registarLog({
            id_utilizador: id_medico_que_consulta,
            tipoAcao: "READ",
            entidadeAfetada: "Ficha_Global_Utente",
            id_registo_afetado: id_utente,
            valorNovo: "Médico consultou o histórico clínico e dashboard do utente."
        });

        // 5. Montar o Objeto JSON Consolidado (O Dashboard)
        return {
           dados_pessoais: {
               nome: utilizador ? utilizador.nome : 'Nome não definido',
               n_sns: utente.numSaude,
               data_nascimento: utente.dataNascimento
            },
            resumo_clinico: {
               total_alertas_ativos: alertas.filter(a => a.estado === 'PENDENTE' || a.estado === 'NOVO').length,
               ultima_avaliacao_carat: avaliacoesCarat.length > 0 ? avaliacoesCarat[0] : null,
               ultimo_sintoma: sintomas.length > 0 ? sintomas[sintomas.length - 1] : null,
            },
            historico_detalhado: {
                avaliacoes_carat: avaliacoesCarat,
                alertas: alertas,
                exames_prescritos: exames,
                medicacao_ativa: medicacoes,
                sintomas_reportados: sintomas,
                intervencoes_clinicas: intervencoes,
               // O FrontEnd agora recebe a info do FHIR automaticamente dentro do Dashboard
                diagnosticos_externos_sns: diagnosticos_externos_fhir 
            }
        };
    }
}