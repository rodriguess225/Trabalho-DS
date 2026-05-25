import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Prescricao } from '../models/prescricao.entity';
import { Exame } from '../models/exame.entity';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';

// ...
export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [Prescricao, Exame, AvaliacaoCarat],
    synchronize: true,
});



