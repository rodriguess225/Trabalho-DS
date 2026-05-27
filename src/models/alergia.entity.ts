import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("alergias")
export class Alergia {
    @PrimaryGeneratedColumn()
    id_alergia: number;

    @Column()
    nomeAlergia: string;
}