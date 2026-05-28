// Define a estrutura da nossa Prescrição no sistema 

export interface Prescricao {
    id: number;
    medicamento: string;
    dose: string;
    medico_nome: string;
    dataCriacao: Date; // Adiciona isto para bater certo com o app.ts
}
export const appConfig = {
    auth: {
        jwtSecret: 'chave-secreta-para-token-123',
        expiresIn: '24h'
    },
};