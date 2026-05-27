import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("intervencoes_clinicas")
export class IntervencaoClinica {
    @PrimaryGeneratedColumn()
    id_intervencao: number;

    @Column()
    id_alerta: number; // FK -> alertas.id_alerta

    @Column()
    id_medico: number; // FK -> medicos.id_medico

    @Column({ type: "datetime" })
    dataRegisto: string;

    @Column({ nullable: true })
    notasMedico: string;

    @Column({ nullable: true })
    acaoTomada: string;

    @CreateDateColumn()
    createdAt: Date;
}