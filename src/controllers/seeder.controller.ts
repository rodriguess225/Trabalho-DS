import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../database/database';

import { Utilizador } from '../models/utilizador.entity';
import { Administrador } from '../models/administrador.entity';
import { Medico } from '../models/medico.entity';
import { Utente } from '../models/utente.entity';
import { Alergia } from '../models/alergia.entity';
import { FichaAnamnese } from '../models/fichaanamnese.entity';
import { FichaPossuiAlergias } from '../models/fichapossuialergias.entity';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { AvaliacaoCARAT } from '../models/avaliacao-carat.entity';
import { RespostaCarat } from '../models/respostacarat.entity';
import { SintomaReportado } from '../models/sintomareportado.entity';
import { Alerta } from '../models/alerta.entity';
import { Medicacao } from '../models/medicacao.entity';
import { Exame } from '../models/exame.entity';
import { IntervencaoClinica } from '../models/intervencaoclinica.entity';
import { LogAuditoria } from '../models/logauditoria.entity';

import { 
    utilizadoresMock, administradoresMock, medicosMock, utentesMock, 
    fichasAnamneseMock, alergiasMock, fichaPossuiAlergiasMock, configLimiaresMock, 
    avaliacoesCaratMock, respostasCaratMock, alertasMock, sintomasMock, 
    medicacoesMock, examesMock, intervencoesMock, logsAuditoriaMock 
} from '../data/dadosTeste';

export class SeederController {
    async povoarBaseDados(req: Request, res: Response) {
        try {
            const utilRepo = AppDataSource.getRepository(Utilizador);
            
            if (await utilRepo.count() > 0) {
                return res.status(400).json({ erro: "A BD já tem dados! Apague o ficheiro da base de dados para limpar primeiro." });
            }

            console.log("A injetar dados de teste...");

            const utilizadoresComHash = await Promise.all(utilizadoresMock.map(async (u) => {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                return { ...u, password: hashedPassword };
            }));

            await utilRepo.save(utilizadoresComHash as any);
            await AppDataSource.getRepository(Administrador).save(administradoresMock as any);
            await AppDataSource.getRepository(Medico).save(medicosMock as any);
            await AppDataSource.getRepository(Utente).save(utentesMock as any);
            await AppDataSource.getRepository(Alergia).save(alergiasMock as any);
            await AppDataSource.getRepository(FichaAnamnese).save(fichasAnamneseMock as any);
            await AppDataSource.getRepository(FichaPossuiAlergias).save(fichaPossuiAlergiasMock as any);
            await AppDataSource.getRepository(ConfiguracaoLimiares).save(configLimiaresMock as any);
            await AppDataSource.getRepository(AvaliacaoCARAT).save(avaliacoesCaratMock as any);
            await AppDataSource.getRepository(RespostaCarat).save(respostasCaratMock as any);
            await AppDataSource.getRepository(SintomaReportado).save(sintomasMock as any);
            await AppDataSource.getRepository(Alerta).save(alertasMock as any);
            await AppDataSource.getRepository(IntervencaoClinica).save(intervencoesMock as any);
            await AppDataSource.getRepository(Medicacao).save(medicacoesMock as any);
            await AppDataSource.getRepository(Exame).save(examesMock as any);
            await AppDataSource.getRepository(LogAuditoria).save(logsAuditoriaMock as any);

            return res.status(201).json({ mensagem: "Sistema povoado com sucesso! Já pode testar." });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ erro: "Erro ao povoar sistema: " + error.message });
        }
    }
}