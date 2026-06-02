export interface IntervencaoResponseDto {
    id_intervencao: number;    // A chave primária (PK) desta tabela
    id_utente: number;         // FK para o utente
    id_medico: number;         // FK para o médico
    notasMedicas: string;
    diagnostico: string | null;
    dataIntervencao: Date;     // Gerado automaticamente pelo sistema no momento da consulta
}