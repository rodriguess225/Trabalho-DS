export interface CreateLogAuditoriaDto {
    id_utilizador?: number;
    tipoAcao: string;
    entidadeAfetada: string;
    id_registo_afetado?: number;
    dataHora?: string; 
    valorAntigo?: string; 
    valorNovo?: string;  
}