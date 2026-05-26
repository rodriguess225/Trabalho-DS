import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AvaliacaoCarat } from './avaliacao-carat.entity';
import { Alerta } from './alerta.entity';

@Entity('utentes')
export class Utente {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column() nome!: string;
    @Column({ unique: true }) email!: string;
    @Column() password!: string;
    @Column({ unique: true }) numeroUtente!: string;
    @Column() dataNascimento!: string;
    
    @Column({ nullable: true }) sexo!: string;
    @Column({ nullable: true }) telefone!: string;
    @Column({ unique: true, nullable: true }) nif!: string;
    @Column({ nullable: true }) morada!: string;

    @OneToMany(() => AvaliacaoCarat, (avaliacao) => avaliacao.utente)
    avaliacoes!: AvaliacaoCarat[];

    @OneToMany(() => Alerta, (alerta) => alerta.utente)
    alertas!: Alerta[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) dataCriacao!: Date;
}