import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("avaliacoes-carat")
export class AvaliacaoCARAT {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    utenteId!: number; 

    @Column({ type: "int" })
    scoreTotal!: number;

    @Column({ type: "int" })
    scoreViasSuperiores!: number;

    @Column({ type: "int" })
    scoreViasInferiores!: number;

    @Column({ type: "varchar", length: 50 })
    nivelControlo!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    recomendacoes!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    proximoPassoSugerido!: string;

    @CreateDateColumn()
    dataAvaliacao!: Date;
}