export interface LogAuditoriaResponseDto {
    id_log_auditoria: number;
    id_utilizador: number | null;
    tipoAcao: string;
    entidadeAfetada: string;
    id_registo_afetado: number | null;
    dataHora: string | null;
    valorAntigo: string | null;
    valorNovo: string | null;
    createdAt: Date;
}