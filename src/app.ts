import 'reflect-metadata';
import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './database/database';

// 1. IMPORTAÇÃO DOS MODELOS (ENTIDADES mantivemos aqui para possiveis alterações futuras)
import { Utilizador } from './models/utilizador.entity';
import { Administrador } from './models/administrador.entity';
import { Medico } from './models/medico.entity';
import { Utente } from './models/utente.entity';
import { Alergia } from './models/alergia.entity';
import { FichaAnamnese } from './models/fichaanamnese.entity';
import { FichaPossuiAlergias } from './models/fichapossuialergias.entity';
import { ConfiguracaoLimiares } from './models/configuracaolimiares.entity';
import { AvaliacaoCARAT } from './models/avaliacao-carat.entity';
import { RespostaCarat } from './models/respostacarat.entity';
import { SintomaReportado } from './models/sintomareportado.entity';
import { Alerta } from './models/alerta.entity';
import { Medicacao } from './models/medicacao.entity';
import { Exame } from './models/exame.entity';
import { IntervencaoClinica } from './models/intervencaoclinica.entity';
import { LogAuditoria } from './models/logauditoria.entity';


// 2. IMPORTAÇÃO DAS ROTAS
import administradorRoutes from './routes/administrador.routes';
import alergiaRoutes from './routes/alergia.routes';
import alertaRoutes from './routes/alerta.routes';
import authRoutes from './routes/auth.routes';
import caratRoutes from './routes/carat.routes';
import configuracaoLimiaresRoutes from './routes/configuracaolimiares.routes';
import dashboardRoutes from './routes/dashboard.routes';
import exameRoutes from './routes/exame.routes';
import fhirRoutes from './routes/fhir.routes';
import fichaAnamneseRoutes from './routes/fichaanamnese.routes';
import fichapossuialergiasRoutes from './routes/fichapossuialergias.route';
import intervencaoClinicaRoutes from './routes/intervencaoclinica.routes';
import logAuditoriaRoutes from './routes/logauditoria.routes';
import medicacaoRoutes from './routes/medicacao.routes';
import medicoRoutes from './routes/medico.routes';
import respostaCaratRoutes from './routes/respostacarat.routes';
import sintomaReportadoRoutes from './routes/sintomareportado.routes';
import utenteRoutes from './routes/utente.routes';
import utilizadorRoutes from './routes/utilizador.routes';
import seederRoutes from './routes/seeder.routes';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// 3. MAPEAMENTO DAS ROTAS
app.use('/administradores', administradorRoutes);
app.use('/alergias', alergiaRoutes);
app.use('/alertas', alertaRoutes);
app.use('/auth', authRoutes);
app.use('/carat', caratRoutes);
app.use('/configuracoes', configuracaoLimiaresRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/exames', exameRoutes);
app.use('/pedidos-exames', exameRoutes); // Mapeamento duplo (como o do professor)
app.use('/fhir', fhirRoutes);
app.use('/fichas-anamnese', fichaAnamneseRoutes);
app.use('/fichas-alergias', fichapossuialergiasRoutes);
app.use('/intervencoes', intervencaoClinicaRoutes);
app.use('/logs', logAuditoriaRoutes);
app.use('/medicacoes', medicacaoRoutes);
app.use('/medicos', medicoRoutes);
app.use('/respostas-carat', respostaCaratRoutes);
app.use('/sintomas', sintomaReportadoRoutes);
app.use('/utentes', utenteRoutes);
app.use('/utilizadores', utilizadorRoutes);
app.use('/seeder', seederRoutes);

// 4. ARRANQUE DA APLICAÇÃO
if (require.main === module) {
    AppDataSource.initialize().then(async () => {
        
        const adminRepo = AppDataSource.getRepository(Administrador);
        const utilizadorRepo = AppDataSource.getRepository(Utilizador);
        
        if (await adminRepo.count() === 0) {
            const passwordAdmin = bcrypt.hashSync('Admin123!', 10);
            
            const userAdmin = await utilizadorRepo.save({
                nome: 'Super Administrador',
                email: 'admin@clinica.pt',
                password: passwordAdmin,
                perfil: 'ADMIN' 
            });

            await adminRepo.save({
                departamento: 'Direção de Sistemas',
                id_utilizador: userAdmin.id // <--- CORREÇÃO: Passar apenas o ID! (Se a tua PK do Utilizador for id_utilizador, usa userAdmin.id_utilizador)
            });
            console.log('✅ SEED: Primeiro Administrador criado com sucesso!');
        }

        // 2. SEED DO MÉDICO
        const medicoRepo = AppDataSource.getRepository(Medico);
        
        if (await medicoRepo.count() === 0) {
            const passwordMedico = bcrypt.hashSync('Medico123!', 10);
            
            const userMedico = await utilizadorRepo.save({
                nome: 'Dr. João Silva',
                email: 'joao.silva@clinica.pt',
                password: passwordMedico,
                perfil: 'MEDICO'
            });

            await medicoRepo.save({
                especialidade: 'Pneumologia',
                cedulaProfissional: '12345',
                id_utilizador: userMedico.id // <--- CORREÇÃO: Passar apenas o ID!
            });
            console.log(' SEED: Primeiro Médico criado com sucesso!');
        }
        app.listen(3000, () =>
            console.log("Servidor (TypeORM + SQLite) a correr na porta 3000")
        );
    }).catch(error => {
        console.log("Erro ao ligar à base de dados:", error);
    });
}

export default app;