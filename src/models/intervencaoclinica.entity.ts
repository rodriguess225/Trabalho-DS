import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("intervencoes_clinicas")
export class IntervencaoClinica {
    @PrimaryGeneratedColumn()
    id_intervencao!: number;

    @Column()
    id_medico!: number; // FK -> medicos.id_medico

    @Column()
    id_utente!: number; //FK -> utentes.id

    @Column({nullable: true})
    id_alerta!: number; // FK -> alertas.id_alerta

    @Column({ type: "datetime" })
    dataRegisto!: string;

    @Column({ nullable: true })
    notasMedicas!: string;

    @Column({ nullable: true })
    acaoTomada!: string;

    @CreateDateColumn()
    createdAt!: Date;
}