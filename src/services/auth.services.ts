/*Esta classe AuthService é responsável por autenticar um utilizador.

Ou seja, recebe:
	•	email
	•	password

e verifica se:
	1.	o utilizador existe na BD
	2.	a password está correta

Se tudo correr bem, gera um token JWT que poderá depois ser usado nas rotas protegidas.*/

import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';
import { appConfig } from '../config/app.config';

export class AuthService {
    async login(email: string, password: string): Promise<string> {
        const utilizadorRepo = AppDataSource.getRepository(Utilizador);
        
        // Procura o utilizador na BD pelo email
        const utilizador = await utilizadorRepo.findOne({ 
            where: { email } 
        });

        if (!utilizador) {
            throw new Error('Credenciais inválidas.');
        }

        // Verifica se a password está correta
        const passwordValida = await bcrypt.compare(password, utilizador.password);

        if (!passwordValida) {
            throw new Error('Credenciais inválidas.');
        }

        // Verifica se o utilizador está ativo
        if (!utilizador.ativo) {
            throw new Error('Utilizador inativo.');
        }

        // Gera o token JWT com os dados do utilizador
        const token = jwt.sign(
            {
                id: utilizador.id,
                email: utilizador.email,
                role: utilizador.perfil
            },
            appConfig.auth.jwtSecret,
            { expiresIn: '24h' }
        );

        return token;
    }
}