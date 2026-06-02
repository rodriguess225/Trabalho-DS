export interface CreateConfiguracaoLimiaresDto {
    id_administrador: number;
    limiar_score: number;
    delta_deterorizacao: number; 
    ultima_atualização?: string; // ter a certeza se isto faz sentido ou se é melhor deixar o backend tratar disso
}