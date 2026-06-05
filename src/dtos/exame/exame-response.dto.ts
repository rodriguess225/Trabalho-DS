export interface ExameResponseDto {
    id_exame: number;
    id_utente: number;
    id_intervencao_clinica: number | null;
    tipoExame: string;
    dataSolicitacao: string;
    resultado: string | null;        
    concluido: boolean;             
}