import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,} from "typeorm";
 
@Entity("administrador")
export class Administrador {
    @PrimaryGeneratedColumn()
    id_administrador!: number;
 
    @Column()
    id_utilizador!: number; 
 
    @CreateDateColumn()
    createdAt!: Date;
 
    @UpdateDateColumn()
    updatedAt!: Date;
}
 