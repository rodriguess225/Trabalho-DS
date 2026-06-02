export interface ConfiguracaoLimiaresResponseDto {
    id_configuracao: number;
    id_administrador: number;
    limiar_score: number;
    delta_deterorizacao: number;
    ultima_atualização: Date;
}
