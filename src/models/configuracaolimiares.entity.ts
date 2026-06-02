import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("configuracao_limiares")
export class ConfiguracaoLimiares {
    @PrimaryGeneratedColumn()
    id_configuracao!: number;

    @Column({ nullable: true })
    id_administrador!: number; // FK -> administradores.id_administrador

    @Column({ type: "int", default: 20 })
    limiar_score!: number;

    @Column({ type: "int", nullable: true })
    limiar_delta_deterorização!: number;

    @Column({ type: "datetime", nullable: true })
    ultima_atualizacao!: string;
}