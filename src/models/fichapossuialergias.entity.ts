import {Entity, PrimaryGeneratedColumn ,Column,} from "typeorm";

// Tabela de ligação entre FichaAnamnese e Alergia
@Entity("ficha_possui_alergias")
export class FichaPossuiAlergias {
    @PrimaryGeneratedColumn()
    id_utente_alergia!: number;

    @Column()
    id_ficha_anamnese!: number; // FK -> fichas_anamnese.id_ficha

    @Column()
    id_alergia!: number; // FK -> alergias.id_alergia
}
