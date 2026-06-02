import express from 'express';
import path from 'path';
import { AppDataSource } from './database/database';
import { Prescricao } from './models/prescricao.entity';
import { Exame } from './models/exame.entity';
import { Utente } from './models/utente.entity';
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
            await exameRepo.save({ nome: 'RX Torax', codigo: 'RX01', medico_nome: 'Dr. House' });
        }

        const utenteRepo = AppDataSource.getRepository(Utente);
        if (await utenteRepo.count() === 0) {
            console.log("A criar utente de teste...");
            await utenteRepo.save({
                nome: 'Paciente Exemplo',
                email: 'paciente@teste.pt',
                password: '123',
                numeroUtente: '123456789',
                dataNascimento: '1985-01-01',
                sexo: 'Masculino',
                nif: '123456789',
                telefone: '912345678',
                morada: 'Rua de Teste, Porto'
            });
            console.log("Utente de teste criado!");
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