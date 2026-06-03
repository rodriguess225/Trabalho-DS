import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { appConfig } from '../config/app.config';

 import {AppDataSource } from '../database/database'; 

export class AuthService {
    
    // --- LÓGICA DE REGISTO ---
    async register(dados: any): Promise<any> {
        // 1. Verificar se o utilizador já existe na BD
        // Exemplo: const userExiste = await db.query('SELECT * FROM users WHERE username = ?', [dados.username]);
        // if (userExiste) throw new Error('Username já está em uso.');

        // 2. Encriptar a password
        const salt = bcrypt.genSaltSync(10);
        const passwordEncriptada = bcrypt.hashSync(dados.password, salt);

        // 3. Guardar na BD com o Role correspondente (Utente, Medico, Admin)
        // Exemplo: await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
        // [dados.username, passwordEncriptada, dados.role]);

        return { mensagem: 'Utilizador registado com sucesso!' };
    }

    // --- LÓGICA DE LOGIN ---
    async login(username: string, password: string): Promise<string> {
        
        // 1. Procurar o utilizador na BD
        // Exemplo: const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        // O "any" resolve o erro do type 'never'
        let user: any = null; 

        // DICA: Se quiseres testar o Login no Postman ANTES de ligares a BD,
        // apaga o "let user: any = null;" em cima e descomenta o código abaixo:
        /*
        let user: any = {
            id: 1,
            username: 'admin',
            // Esta password é '12345' já encriptada com bcrypt para poderes testar!
            password: '$2a$10$Wb/jY.pE./J4x5X1F9z.O.Tz3q9hT3t5u/X0yDk/tX1/X.X.X.X.X', 
            role: 'Admin'
        };
        */

        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        // 2. Comparar a password enviada com a password encriptada na BD
        const passwordValida = bcrypt.compareSync(password, user.password);

        if (!passwordValida) {
            throw new Error('Credenciais inválidas.');
        }

        // 3. Gerar o Token JWT
        // Os "as jwt.Secret" e "as any" resolvem o erro de overload do TypeScript
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            appConfig.auth.jwtSecret as jwt.Secret,
            { expiresIn: appConfig.auth.expiresIn as any }
        );

        // 4. REGISTO DE AUDITORIA
        // Exemplo: await db.query('INSERT INTO audit_logs (user_id, acao, data) VALUES (?, ?, ?)', 
        // [user.id, 'LOGIN', new Date()]);

        return token;
    }
}