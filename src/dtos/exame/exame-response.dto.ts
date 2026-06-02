export interface ExameResponseDto {
  id: number;
  id_utente: number;
  id_intervencao_clinica: number;
  tipoExame: string;
  dataSolicitacao: string;
  resultado: string;
  concluido: boolean;
}