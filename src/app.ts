import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './database/database';
import { Prescricao } from './models/prescricao.entity';
import { Exame } from './models/exame.entity';
import { Utente } from './models/utente.entity';
import { Utilizador } from './models/utilizador.entity';
import exameRoutes from './routes/exame.routes';
import prescricaoRoutes from './routes/prescricao.routes';
import caratRoutes from './routes/carat.routes';
import utenteRoutes from './routes/utente.routes';
import fhirRoutes from './routes/fhir.routes';
import alertasRoutes from './routes/alertas.routes';
import authRoutes from './routes/auth.routes';


const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use('/auth', authRoutes);

app.use('/prescricoes', prescricaoRoutes);
app.use('/exames', exameRoutes);
app.use('/pedidos-exames', exameRoutes);
app.use('/carat', caratRoutes);
app.use('/utentes', utenteRoutes);
app.use('/fhir', fhirRoutes);
app.use('/alertas', alertasRoutes);

async function start() {
    try {
        // Se já estiver ligado, não tenta ligar outra vez
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("Base de dados conectada!");
        }

        const prescricaoRepo = AppDataSource.getRepository(Prescricao);
        if (await prescricaoRepo.count() === 0) {
            await prescricaoRepo.save({ medicamento: 'Aspirina', dose: '500mg', medico_nome: 'Dr. House', dataCriacao: new Date() });
        }

        const exameRepo = AppDataSource.getRepository(Exame);
        if (await exameRepo.count() === 0) {
            const hoje = new Date();
            const dataSolicitacao: string = hoje.toISOString().split('T')[0] || '2024-01-01';
            await exameRepo.save({ 
                tipoExame: 'RX Torax', 
                id_utente: 1, 
                dataSolicitacao: dataSolicitacao 
            });
        }

        const utenteRepo = AppDataSource.getRepository(Utente);
        if (await utenteRepo.count() === 0) {
            console.log("A criar utente de teste...");
            await utenteRepo.save({
                id_utilizador: 1,
                dataNascimento: '1985-01-01',
                morada: 'Rua de Teste, Porto',
                genero: 'Masculino',
                numSaude: '123456789',
                nif: 123456789
            });
            console.log("Utente de teste criado!");
        }

        // Criar utilizadores de teste (UTENTE, MEDICO, ADMIN)
        const utilizadorRepo = AppDataSource.getRepository(Utilizador);
        if (await utilizadorRepo.count() === 0) {
            console.log("A criar utilizadores de teste...");

            // Hash das passwords
            const passwordUtenteHash = await bcrypt.hash('utente123', 10);
            const passwordMedicoHash = await bcrypt.hash('medico123', 10);
            const passwordAdminHash = await bcrypt.hash('admin123', 10);

            await utilizadorRepo.save([
                {
                    nome: 'João Silva - Utente',
                    email: 'utente@teste.pt',
                    password: passwordUtenteHash,
                    perfil: 'UTENTE',
                    ativo: true,
                    telemovel: '912345678'
                },
                {
                    nome: 'Dr. António Pereira - Médico',
                    email: 'medico@teste.pt',
                    password: passwordMedicoHash,
                    perfil: 'MEDICO',
                    ativo: true,
                    telemovel: '917654321'
                },
                {
                    nome: 'Administrador do Sistema',
                    email: 'admin@teste.pt',
                    password: passwordAdminHash,
                    perfil: 'ADMIN',
                    ativo: true,
                    telemovel: '918765432'
                }
            ]);

            console.log("Utilizadores de teste criados!");
            console.log("\n📋 Credenciais de Teste:");
            console.log("  UTENTE: utente@teste.pt / utente123");
            console.log("  MEDICO: medico@teste.pt / medico123");
            console.log("  ADMIN:  admin@teste.pt / admin123\n");
        }

        // Tenta iniciar o servidor. Se a porta 3000 estiver ocupada, ele avisa.
        app.listen(3000, () => {
            console.log("Servidor a correr na porta 3000");
        });

    } catch (err) {
        console.error("Erro ao iniciar:", err);
    }
}

if (require.main === module) {
    start();
}

export default app;