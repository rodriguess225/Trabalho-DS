import { UtilizadorResponseDto } from '../utilizador/utilizador-response.dto';

export interface AdministradorResponseDto {
    id_administrador: number; 
    id_Utilizador: number;
    utilizador: UtilizadorResponseDto; // Composição para incluir os dados do utilizador associado
}
