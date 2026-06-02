export interface CreateUtenteDto {
    id_utilizador: number; // FK -> utilizadores.id
    id_medico: number; // FK -> medicos.id_medico
    numSaude: string;
    dataNascimento: string;
    genero?: string;
    nif?: string;
    morada?: string;
}