export interface CreateUtenteDto {
    nome: string;
    email: string;
    password: string;
    numeroUtente: string;
    dataNascimento: string;
    sexo?: string;
    telefone?: string;
    nif?: string;
    morada?: string;
}