import { CreateRespostaCaratDto } from '../respostacarat/create-respostacarat.dto'; // <-- Adicionar este import

export interface CreateAvaliacaoCaratDto {
    id_utente: number;
    scoreTotal: number;
    scoreViasSuperiores: number;
    scoreViasInferiores: number;
    nivelControlo: string;
    recomendacoes?: string;
    proximoPassoSugerido?: string;
    
    respostas: CreateRespostaCaratDto[]; 
}

