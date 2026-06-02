export interface CreateUtilizadorDto {
    nome: string;
    email: string;
    password: string; 
    perfil: string;
    telemovel?: string; 
}