import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from "typeorm";
 
@Entity("exames")
export class Exame {
    @PrimaryGeneratedColumn()
    id_exame!: number;
 
    @Column()
    id_utente!: number; // FK -> utentes.id_utente
 
    @Column({ nullable: true })
    id_intervencao_clinica!: number; // FK -> intervencoes_clinicas.id_intervencao

    @Column({ nullable: true })
    tipoExame!: string;
 
    @Column({ type: "date", nullable: true })
    dataSolicitacao!: string;
 
    @Column({ nullable: true })
    resultado!: string;
 
    @Column({ default: false })
    concluido!: boolean;
 
    @CreateDateColumn()
    createdAt!: Date;
}
 