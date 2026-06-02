export interface UtenteResponseDto {
    id: string;
    id_utilizador: number;
    id_medico: number;
    nome: string;
    email: string;
    numSaude: string;
    dataNascimento: string;
    genero: string;
    telefone: string;
    nif: string;
    morada: string;
    dataCriacao: Date;
}