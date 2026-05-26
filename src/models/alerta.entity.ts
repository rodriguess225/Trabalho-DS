import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';
import { Medico } from './medico.entity';

@Entity('alertas')
export class Alerta {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Utente, (utente) => utente.alertas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'utente_id' })
    utente!: Utente;

    @ManyToOne(() => Medico, (medico) => medico.alertas, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'medico_id' })
    medico!: Medico;

    @Column() tipoAlerta!: string;
    @Column() descricao!: string;
    @Column({ default: false }) lido!: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) dataCriacao!: Date;
}