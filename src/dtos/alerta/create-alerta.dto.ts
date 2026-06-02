export interface CreateAlertaDto {
    id_utente: number;
    id_medico: number;
    id_avaliacao_origem?: number;
    tipo: string;
    prioridade?: string;
    estado?: string; 
    motivo?: string;
    dataGeracao?: string; 
}