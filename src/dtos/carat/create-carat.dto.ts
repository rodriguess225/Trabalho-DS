import { CreateRespostaCaratDto } from '../respostacarat/create-respostacarat.dto'; // <-- Adicionar este import

export interface CreateAvaliacaoCaratDto {
    utenteId: number;
    scoreTotal: number;
    scoreViasSuperiores: number;
    scoreViasInferiores: number;
    nivelControlo: string;
    recomendacoes?: string;
    proximoPassoSugerido?: string;
    
    respostas: CreateRespostaCaratDto[]; // Fica a usar o DTO que acabaste de criar
}

