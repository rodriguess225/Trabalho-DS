import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,} from "typeorm";
 
@Entity("utentes")
export class Utente {

    @PrimaryGeneratedColumn()
    id_utente!: number;
 
    @Column()
    id_utilizador!: number; // FK -> utilizadores.id
 
    @Column({ nullable: true })
    id_medico!: number; // FK -> medicos.id_medico
 
    @Column({ type: "date", nullable: true })
    dataNascimento!: string;
 
    @Column({ nullable: true })
    morada!: string;
 
    @Column({ nullable: true })
    genero!: string;
 
    @Column({ nullable: true })
    numSaude!: string;
 
    @Column({ nullable: true })
    nif!: number;
 
    @CreateDateColumn()
    createdAt!: Date;
 
    @UpdateDateColumn()
    updatedAt!: Date;
}
