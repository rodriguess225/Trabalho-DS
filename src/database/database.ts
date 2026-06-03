import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Exame } from '../models/exame.entity';
import { AvaliacaoCARAT } from '../models/avaliacao-carat.entity';
import { RespostaCarat } from '../models/respostacarat.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Administrador } from '../models/administrador.entity';
import { Alerta } from '../models/alerta.entity';
import { LogAuditoria } from '../models/logauditoria.entity';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { IntervencaoClinica } from '../models/intervencaoclinica.entity';
import { SintomaReportado } from '../models/sintomareportado.entity';
import { Medicacao } from '../models/medicacao.entity';
import { FichaAnamnese } from '../models/fichaanamnese.entity';
import { FichaPossuiAlergias } from '../models/fichapossuialergias.entity';
import { Alergia } from '../models/alergia.entity';
import { Utilizador } from '../models/utilizador.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'database.db',
    entities: [
        Exame,
        AvaliacaoCARAT,
        RespostaCarat,
        Utente,
        Medico,
        Administrador,
        Alerta,
        LogAuditoria,
        ConfiguracaoLimiares,
        IntervencaoClinica,
        SintomaReportado,
        Medicacao,
        FichaAnamnese,
        FichaPossuiAlergias,
        Alergia,
        Utilizador
    ],
    synchronize: true,
});