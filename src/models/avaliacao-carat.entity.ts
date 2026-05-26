import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';

@Entity('avaliacoes_carat')
export class AvaliacaoCarat {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Utente, (utente) => utente.avaliacoes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'utente_id' })
    utente!: Utente;

    @Column() q1!: number;
    @Column() q2!: number;
    @Column() q3!: number;
    @Column() q4!: number;
    @Column() q5!: number;
    @Column() q6!: number;
    @Column() q7!: number;
    @Column() q8!: number;
    @Column() q9!: number;
    @Column() q10!: number;

    @Column() scoreSuperiores!: number;
    @Column() scoreInferiores!: number;
    @Column() scoreTotal!: number;
    @Column() nivelControlo!: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) dataAvaliacao!: Date;
}