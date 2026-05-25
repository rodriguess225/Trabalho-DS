import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('avaliacao_carat')
export class AvaliacaoCarat {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    utente_id!: string;

    // Respostas individuais (0 a 3)
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

    // Scores Calculados
    @Column()
    scoreSuperiores!: number;

    @Column()
    scoreInferiores!: number;

    @Column()
    scoreTotal!: number;

    //ver isto do nivel de controlo 
    @Column()
    nivelControlo!: string;

    @Column()
    dataAvaliacao!: Date;
}