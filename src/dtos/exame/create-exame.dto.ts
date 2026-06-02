export interface CreateExameDto {
    id_utente: number;
    tipoExame: string;               
    id_intervencao_clinica?: number; 
    dataSolicitacao?: string;        
}