import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

// Tabela separada para cada resposta do questionário CARAT
@Entity("respostas_carat")
export class RespostaCarat {
    @PrimaryGeneratedColumn()
    id_resposta!: number;

    @Column()
    id_avaliacao!: number; // FK -> avaliacoes_carat.id_avaliacao

    @Column({ type: "int" })
    num_pergunta!: number;

    @Column({ type: "int" })
    valor_premium!: number;
}

