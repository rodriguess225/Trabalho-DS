
export interface CreateExameDto {
  id_utente: number; // FK -> utentes.id
  id_intervencao_clinica: number; // FK -> intervencoes_clinicas.id_intervencao
  tipoExame: string;
  dataSolicitacao: string;
  resultado: string;
  concluido: boolean;
}