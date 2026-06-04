import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { appConfig } from '../config/app.config';
import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';
import { Utente } from '../models/utente.entity';

export class AuthService {
    private utilizadorRepo = AppDataSource.getRepository(Utilizador);

    // --- LÓGICA DE REGISTO ---
    async register(dados: any): Promise<any> {
        // 1. Verificar se o utilizador já existe (através do email)
        const userExiste = await this.utilizadorRepo.findOneBy({ email: dados.email });
        if (userExiste) throw new Error('Este email já está em uso.');

        // 2. Encriptar a password
        const salt = bcrypt.genSaltSync(10);
        const passwordEncriptada = bcrypt.hashSync(dados.password, salt);

        // 3. Guardar na BD
        const novoUtilizador = this.utilizadorRepo.create({
            nome: dados.nome,
            email: dados.email,
            password: passwordEncriptada,
            perfil: dados.perfil || 'UTENTE', 
            telemovel: dados.telemovel
        });

        // Guardar o utilizador numa variável
        const userGuardado = await this.utilizadorRepo.save(novoUtilizador);

        // Devolver o utilizador 
        return { 
            mensagem: 'Utilizador registado com sucesso!',
            utilizador: userGuardado 
        };
    }

    // --- LÓGICA DE LOGIN ---
    async login(email: string, password: string): Promise<string> {
        // 1. Procurar o utilizador na BD pelo email
        const user = await this.utilizadorRepo.findOneBy({ email: email });

        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        // 2. Comparar a password enviada com a password encriptada na BD
        const passwordValida = bcrypt.compareSync(password, user.password);
        if (!passwordValida) {
            throw new Error('Credenciais inválidas.');
        }

        // Atualizar o último login 
        user.ultimoLogin = new Date().toISOString();
        await this.utilizadorRepo.save(user);

        // 3. Gerar o Token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.perfil 
            },
            appConfig.auth.jwtSecret as jwt.Secret,
            { expiresIn: appConfig.auth.expiresIn as any }
        );

        return token;
    }
async registarUtente(dados: any) {
        const utilizadorRepo = AppDataSource.getRepository(Utilizador);
        const utenteRepo = AppDataSource.getRepository(Utente);

        // 1. Verificar se o email já existe
        const existe = await utilizadorRepo.findOne({ where: { email: dados.email } });
        if (existe) {
            throw new Error("Este email já está em uso.");
        }

        // 2. Encriptar a password
        const hashPassword = await bcrypt.hash(dados.password, 10);

        // 3. Criar a conta de Login (Tabela Principal)
        
        const novoUtilizador = utilizadorRepo.create({
            nome: dados.nome, 
            email: dados.email,
            password: hashPassword,
            perfil: 'UTENTE' 
        });
        
        const utilSalvo = await utilizadorRepo.save(novoUtilizador);

       // 4. Criar o Perfil Clínico Associado (Tabela Secundária)
        const novoUtente = utenteRepo.create({
            id_utilizador: utilSalvo.id,
            nif: Number(dados.nif), 
            morada: dados.morada,
            genero: dados.genero,   
            numSaude: dados.numSaude, 
            dataNascimento: dados.dataNascimento 
        } as any); 
        
        await utenteRepo.save(novoUtente);

        return utilSalvo;
    }
}