export interface ExameResponseDto {
    id_exame: number;
    id_utente: number;
    id_intervencao_clinica: number | null;
    tipoExame: string;
    dataSolicitacao: string;
    resultado: string | null;        // Começa a null até o laboratório/médico preencher
    concluido: boolean;              // Começa a false na base de dados
}