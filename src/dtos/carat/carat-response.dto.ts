import { RespostaCaratResponseDto } from '../respostacarat/respostacarat-response.dto';

export interface CaratResponseDto {
    id: number;
    utenteId: number;
    scoreTotal: number;
    scoreViasSuperiores: number;
    scoreViasInferiores: number;
    nivelControlo: string;
    recomendacoes: string | null;
    proximoPassoSugerido: string | null;
    dataAvaliacao: Date;
    
    respostas?: RespostaCaratResponseDto[]; 
}