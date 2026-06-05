export interface CreateConfiguracaoLimiaresDto {
    id_administrador: number;
    limiar_score: number;
    delta_deterioracao: number; 
    ultima_atualização?: string; 
}