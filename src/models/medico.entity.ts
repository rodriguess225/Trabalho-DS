import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Alerta } from './alerta.entity';

@Entity('medicos')
export class Medico {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column() nome!: string;
    @Column({ unique: true }) email!: string;
    @Column() password!: string;
    @Column({ unique: true }) carteiraProfissional!: string;
    @Column() especialidade!: string;
    @Column({ nullable: true }) telefone!: string;

    @OneToMany(() => Alerta, (alerta) => alerta.medico)
    alertas!: Alerta[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) dataCriacao!: Date;
}