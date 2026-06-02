export interface CreateMedicoDto {
    id_utilizador: number; // FK -> utilizadores.id
    especialidade?: string;
    numCedula?: string;
    instituicao?: string;
    
}