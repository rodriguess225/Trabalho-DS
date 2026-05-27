import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,} from "typeorm";
 
@Entity("utilizadores")
export class Utilizador {
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    nome: string;
 
    @Column({ unique: true })
    email: string;
 
    @Column()
    password: string;
 
    @Column()
    perfil: string; // "UTENTE" | "MEDICO" | "ADMIN"
 
    @Column({ default: true })
    ativo: boolean;
 
    @Column({ nullable: true })
    telemovel: string;
 
    @Column({ nullable: true, type: "date" })
    ultimoLogin: string;
 
    @CreateDateColumn()
    createdAt: Date;
 
    @UpdateDateColumn()
    updatedAt: Date;
}
