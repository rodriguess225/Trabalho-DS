export interface ConfiguracaoLimiaresResponseDto {
    id_configuracao: number;
    id_administrador: number;
    limiar_score: number;
    delta_deterioracao: number;
    ultima_atualização: Date;
}
