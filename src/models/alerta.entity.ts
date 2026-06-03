import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from "typeorm";
 
@Entity("alertas")
export class Alerta {
    @PrimaryGeneratedColumn()
    id_alerta!: number;
 
    @Column()
    id_utente!: number; // FK -> utentes.id_utente
 
    @Column()
    id_medico!: number; // FK -> medicos.id_medico
 
    @Column({ nullable: true })
    id_avaliacao_origem!: number | null; // FK -> avaliacoes_carat.id_avaliacao
 
    @Column()
    tipo!: string;
 
    @Column({nullable: true })
    prioridade!: string | null; 
 
    // "NOVO" | "VISTO" | "EM_SEGUIMENTO" | "FECHADO"
    @Column({ default: "NOVO" })
    estado!: string;
 
    @Column({ nullable: true })
    motivo!: string | null; 
 
    @Column({ type: "datetime", nullable: true })         //estas duas parecem iguais
    dataGeracao!: string;
 
    @CreateDateColumn()
    createdAt!: Date;
}