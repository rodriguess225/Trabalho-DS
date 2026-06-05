import { UtilizadorResponseDto } from '../utilizador/utilizador-response.dto';

export interface MedicoResponseDto {
    id_medico: number;
    especialidade: string | null;
    numCedula: string | null;
    instituicao: string | null;
    createdAt: Date;
    utilizador: UtilizadorResponseDto; 
}