import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("respostas_carat")
export class RespostaCarat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    avaliacaoId!: number; 

    @Column({ type: "int" })
    num_pergunta!: number; // 1 a 10

    @Column({ type: "int" })
    valor!: number; // O valor da resposta escolhida
}