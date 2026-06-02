export interface CreateFichaAnamneseDto {
    id_utente: number;
    estadoTabagico?: string;
    antecedentes?: string;
    peso?: number;
    altura?: number;
    alergias?: string[]; 
}