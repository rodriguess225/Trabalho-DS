export interface AlertaResponseDto {
    id_alerta: number;
    id_utente: number;
    id_medico: number;
    id_avaliacao_origem: number | null;
    tipo: string;
    prioridade: string | null;
    estado: string;
    motivo: string | null;
    dataGeracao: string | null;
    createdAt: Date;
}