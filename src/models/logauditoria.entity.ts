import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from "typeorm";

@Entity("logs_auditoria")
export class LogAuditoria {
    @PrimaryGeneratedColumn()
    id_log_auditoria!: number;

    @Column({ nullable: true })
    id_utilizador!: number; // FK -> utilizadores.id

    @Column()
    tipoAcao!: string; // "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT"

    @Column()
    entidadeAfetada!: string; // Ex: "AvaliacaoCARAT" | "Alerta" | "Utilizador"

    @Column({ nullable: true })
    id_registo_afetado!: number; 

    @Column({ type: "datetime", nullable: true })
    dataHora!: string;

    @Column({ nullable: true })
    valorAntigo!: string;

    @Column({ nullable: true })
    valorNovo!: string;

    @CreateDateColumn()
    createdAt!: Date;
}