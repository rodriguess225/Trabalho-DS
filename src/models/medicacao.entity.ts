import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from "typeorm";

@Entity("medicacoes")
export class Medicacao {
    @PrimaryGeneratedColumn()
    id_medicacao!: number;

    @Column()
    id_utente!: number; // FK -> utentes.id_utente

    @Column({ nullable: true })
    id_intervencao_clinica!: number; // FK -> intervencoes_clinicas.id_intervencao

    @Column()
    nomeMedicacao!: string;

    @Column({ nullable: true })
    dose!: string;

    @Column({ nullable: true })
    frequencia!: string;

    @Column({ type: "date", nullable: true })
    dataPrescricao!: string;

    @Column({ type: "date", nullable: true })
    dataFinal!: string;

    @CreateDateColumn()
    createdAt!: Date;
}