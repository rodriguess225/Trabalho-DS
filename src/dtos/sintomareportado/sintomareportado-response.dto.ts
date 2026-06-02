export interface SintomaReportadoResponseDto {
    id_sintoma: number;
    id_utente: number;
    tipoSintoma: string | null;
    gravidade: number | null;
    dataSintoma: string | null;
    numSintoma: string | null;
    descricao: string | null;
    sintomaPresistente: boolean;
    createdAt: Date;
}