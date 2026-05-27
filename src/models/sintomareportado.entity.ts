import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("sintomas_reportados")
export class SintomaReportado {
    @PrimaryGeneratedColumn()
    id_sintoma: number;

    @Column()
    id_utente: number; // FK -> utentes.id_utente

    @Column({ nullable: true })
    tipoSintoma: string;

    @Column({ type: "int", nullable: true })
    gravidade: number;

    @Column({ type: "datetime", nullable: true })
    dataSintoma: string;

    @Column({ nullable: true })
    numSintoma: string;

    @Column({ nullable: true })
    descricao: string;

    @Column({ default: false })
    sintomaPresistente: boolean;

    @CreateDateColumn()
    createdAt: Date;
}