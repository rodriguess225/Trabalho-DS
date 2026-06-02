export interface CreateSintomaReportadoDto {
    id_utente: number;
    tipoSintoma?: string;
    gravidade?: number;
    dataSintoma?: string; 
    numSintoma?: string;
    descricao?: string;
    sintomaPresistente?: boolean; 
}