import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("fichas_anamnese")
export class FichaAnamnese {
    @PrimaryGeneratedColumn()
    id_ficha!: number;

    @Column()
    id_utente!: number; // FK -> utentes.id_utente (one-to-one)

    @Column({ nullable: true })
    estiloVida!: string;

    @Column({ nullable: true })
    antecedentes!: string;

    @Column({ type: "float", nullable: true })
    peso!: number;

    @Column({ type: "float", nullable: true })
    altura!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}