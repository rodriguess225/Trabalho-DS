export interface CreateUtenteDto {
    id_utilizador: number; 
    id_medico: number; 
    numSaude: string;
    dataNascimento: string;
    genero?: string;
    nif?: number;
    morada?: string;
}