import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
 
@Entity("medicos")
export class Medico {
    @PrimaryGeneratedColumn()
    id_medico!: number;
 
    @Column()
    id_utilizador!: number; // FK -> utilizadores.id
 
    @Column({ nullable: true })
    especialidade!: string;
 
    @Column({ nullable: true })
    numCedula!: string;
 
    @Column({ nullable: true })
    instituicao!: string;
 
    @CreateDateColumn()
    createdAt!: Date;
 
    @UpdateDateColumn()
    updatedAt!: Date;
}
 