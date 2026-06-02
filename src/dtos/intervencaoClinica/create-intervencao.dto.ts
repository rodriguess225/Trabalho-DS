export interface CreateIntervencaoDto {
    id_utente: number;       
    id_medico: number;
    id_alerta?: number;      
    notasMedicas?: string;   
    acoesTomadas?: string;
}