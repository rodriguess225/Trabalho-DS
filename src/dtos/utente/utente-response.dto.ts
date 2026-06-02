import { UtilizadorResponseDto } from '../utilizador/utilizador-response.dto';

export interface UtenteResponseDto {
    id_utente: number;
    id_medico: number | null;
    numSaude: string | null;
    dataNascimento: string | null;
    genero: string | null;
    nif: number | null;
    morada: string | null;
    ativo: boolean;
    createdAt: Date;
    utilizador: UtilizadorResponseDto; // Composição para incluir os dados do utilizador associado
}
