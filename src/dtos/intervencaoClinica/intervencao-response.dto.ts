export interface IntervencaoResponseDto {
    id_intervencao: number;    
    id_utente: number;         
    id_medico: number;         
    notasMedicas: string;
    diagnostico: string | null;
    dataIntervencao: Date;     
}