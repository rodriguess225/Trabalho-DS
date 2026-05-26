import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('administradores')
export class Administrador {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column() nome!: string;
    @Column({ unique: true }) email!: string;
    @Column() password!: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) dataCriacao!: Date;
}