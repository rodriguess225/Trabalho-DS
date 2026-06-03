export const appConfig = {
    port: process.env.PORT || 3000,
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'uma-chave-local-simples-para-ja',
        expiresIn: '24h' // O token expira em 24 horas
    }
};