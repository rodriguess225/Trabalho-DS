import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from "typeorm";
 
@Entity("alertas")
export class Alerta {
    @PrimaryGeneratedColumn()
    id_alerta!: number;
 
    @Column()
    id_utente!: number; // FK -> utentes.id_utente
 
    @Column()
    id_medico!: number; // FK -> medicos.id_medico
 
  @Column({ type: "int", nullable: true })
    id_avaliacao_origem!: number | null; // FK -> avaliacoes_carat.id_avaliacao
 
    @Column()
    tipo!: string;
 
    @Column({ type: "varchar", length: 50, nullable: true })
prioridade!: string | null;
 
    // "NOVO" | "VISTO" | "EM_SEGUIMENTO" | "FECHADO"
    @Column({ default: "NOVO" })
    estado!: string;
 
    @Column({ type: "varchar", length: 255, nullable: true })
motivo!: string | null;
 
    @Column({ type: "datetime", nullable: true })         
    dataGeracao!: string;
 
    @CreateDateColumn()
    createdAt!: Date;
}