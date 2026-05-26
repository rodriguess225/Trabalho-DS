import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Prescricao } from '../models/prescricao.entity';
import { Exame } from '../models/exame.entity';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Administrador } from '../models/administrador.entity';
import { Alerta } from '../models/alerta.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [Prescricao, Exame, AvaliacaoCarat, Utente, Medico, Administrador, Alerta],
    synchronize: true, 
}); 



