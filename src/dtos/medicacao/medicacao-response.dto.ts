export interface MedicacaoResponseDto {
    id_medicacao: number;
    id_utente: number;
    id_intervencao_clinica: number | null;
    nomeMedicacao: string;
    dose: string;
    frequencia: string;
    dataPrescricao: string;
    dataFinal: string | null;
    createdAt: Date;
}