import { AlergiaResponseDto } from '../alergia/alergia-response.dto';

export interface FichaAnamneseResponseDto {
    id_ficha: number;
    id_utente: number;
    estadoTabagico: string | null;
    antecedentes: string | null;
    peso: number | null;
    altura: number | null;
    createdAt: Date;
    updatedAt: Date;
    alergias: AlergiaResponseDto[]; // Lista de alergias associadas a esta ficha de anamnese
}