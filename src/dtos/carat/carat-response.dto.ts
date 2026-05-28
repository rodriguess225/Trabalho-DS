// Define os dados devolvidos ao cliente na resposta. 
// (Podemos não querer devolver as respostas todas, apenas o resultado do cálculo)
export interface CaratResponseDto {
    id: number;
    utente_id: string;
    scoreSuperiores: number;
    scoreInferiores: number;
    scoreTotal: number;
    nivelControlo: string;
    dataAvaliacao: Date;
    recomendacoes: string; 
    proximoPassoSugerido?: string;
}