// FILE: src/data/dadosTeste.ts

// ==========================================
// 1. UTILIZADORES E PERFIS DE ACESSO
// ==========================================
export const utilizadoresMock = [
    // Admin (ID 1)
    { nome: 'Admin Supremo', email: 'admin@medcids.pt', password: 'Admin@123', perfil: 'ADMINISTRADOR', ativo: true },
    
    // Médicos (IDs 2 e 3)
    { nome: 'Dr. Gregory House', email: 'house@medcids.pt', password: 'House@123', perfil: 'MEDICO', ativo: true },
    { nome: 'Dra. Lisa Cuddy', email: 'cuddy@medcids.pt', password: 'Cuddy@123', perfil: 'MEDICO', ativo: true },
    
    // Utentes (IDs 4, 5 e 6)
    { nome: 'João Paciente', email: 'joao@mail.com', password: 'Joao@123', perfil: 'UTENTE', ativo: true },
    { nome: 'Maria Silva', email: 'maria@mail.com', password: 'Maria@123', perfil: 'UTENTE', ativo: true },
    { nome: 'Carlos Mendes', email: 'carlos@mail.com', password: 'Carlos@123', perfil: 'UTENTE', ativo: true }
];

export const administradoresMock = [
    { id_utilizador: 1 } 
];

export const medicosMock = [
    { id_utilizador: 2, especialidade: 'Pneumologia', numCedula: '12345', instituicao: 'Hospital de S. João' },
    { id_utilizador: 3, especialidade: 'Imunoalergologia', numCedula: '54321', instituicao: 'Hospital de S. João' } 
];

// ==========================================
// 2. UTENTES E REGISTO CLÍNICO INICIAL
// ==========================================
export const utentesMock = [
    { id_utilizador: 4, id_medico: 1, dataNascimento: '1980-05-15', genero: 'Masculino', numSaude: '111111111', nif: 100000001, morada: 'Porto' }, 
    { id_utilizador: 5, id_medico: 2, dataNascimento: '1995-08-22', genero: 'Feminino', numSaude: '222222222', nif: 200000002, morada: 'Matosinhos' }, 
    { id_utilizador: 6, id_medico: 1, dataNascimento: '1965-03-10', genero: 'Masculino', numSaude: '333333333', nif: 300000003, morada: 'Gaia' } 
];

export const fichasAnamneseMock = [
    { id_utente: 1, estadoTabagico: 'Ex-fumador', antecedentes: 'Asma diagnosticada aos 8 anos', peso: 75.5, altura: 1.78 },
    { id_utente: 2, estadoTabagico: 'Nunca fumou', antecedentes: 'Rinite alérgica sazonal', peso: 62.0, altura: 1.65 },
    { id_utente: 3, estadoTabagico: 'Fumador ativo', antecedentes: 'DPOC em fase inicial', peso: 88.0, altura: 1.72 }
];

export const alergiasMock = [
    { nomeAlergia: 'Pólen de Oliveira' },
    { nomeAlergia: 'Ácaros (Dermatophagoides)' },
    { nomeAlergia: 'Pêlo de Gato' },
    { nomeAlergia: 'Amendoim' }
];

export const fichaPossuiAlergiasMock = [
    { id_ficha_anamnese: 1, id_alergia: 1 }, 
    { id_ficha_anamnese: 1, id_alergia: 2 }, 
    { id_ficha_anamnese: 2, id_alergia: 3 },
    { id_ficha_anamnese: 3, id_alergia: 4 }
];

export const configLimiaresMock = [
    { id_administrador: 1, limiar_score: 24, limiar_delta_deterioracao: 4 }
];

// ==========================================
// 3. AVALIAÇÕES CARAT (Histórico e Detalhes)
// ==========================================
const hoje = new Date();
const mesPassado = new Date(); mesPassado.setMonth(hoje.getMonth() - 1);
const doisMesesAtras = new Date(); doisMesesAtras.setMonth(hoje.getMonth() - 2);

export const avaliacoesCaratMock = [
    // João: 3 Avaliações
    { utenteId: 1, scoreTotal: 26, scoreViasSuperiores: 10, scoreViasInferiores: 16, nivelControlo: 'Asma e Rinite Controladas', recomendacoes: 'Manter terapêutica.', proximoPassoSugerido: 'Reavaliar em 6 meses.', dataAvaliacao: doisMesesAtras },
    { utenteId: 1, scoreTotal: 22, scoreViasSuperiores: 9, scoreViasInferiores: 13, nivelControlo: 'Controlo Insuficiente', recomendacoes: 'Reforçar medicação SOS.', proximoPassoSugerido: 'Reavaliar num mês.', dataAvaliacao: mesPassado },
    { utenteId: 1, scoreTotal: 16, scoreViasSuperiores: 6, scoreViasInferiores: 10, nivelControlo: 'Asma Não Controlada', recomendacoes: 'Rever adesão à terapêutica inalatória.', proximoPassoSugerido: 'Consulta de urgência.', dataAvaliacao: hoje }, 
    
    // Maria: 1 Avaliação
    { utenteId: 2, scoreTotal: 28, scoreViasSuperiores: 11, scoreViasInferiores: 17, nivelControlo: 'Asma e Rinite Controladas', recomendacoes: 'Excelente controlo.', proximoPassoSugerido: 'Consulta de rotina anual.', dataAvaliacao: hoje },
    
    // Carlos: 1 Avaliação
    { utenteId: 3, scoreTotal: 12, scoreViasSuperiores: 4, scoreViasInferiores: 8, nivelControlo: 'Asma Não Controlada', recomendacoes: 'Deterioração severa. Ajuste de medicação urgente.', proximoPassoSugerido: 'Reavaliação em 48 horas.', dataAvaliacao: hoje }
];

// ==========================================
// 4. RESPOSTAS CARAT INDIVIDUAIS (Matemática Perfeita)
// ==========================================
export const respostasCaratMock = [
    // AVALIAÇÃO 1 (João - 2 Meses Atrás) | Total: 26 | Sup: 10 | Inf: 16
    { avaliacaoId: 1, num_pergunta: 1, valor: 3 }, { avaliacaoId: 1, num_pergunta: 2, valor: 3 },
    { avaliacaoId: 1, num_pergunta: 3, valor: 2 }, { avaliacaoId: 1, num_pergunta: 4, valor: 2 }, 
    { avaliacaoId: 1, num_pergunta: 5, valor: 3 }, { avaliacaoId: 1, num_pergunta: 6, valor: 3 },
    { avaliacaoId: 1, num_pergunta: 7, valor: 2 }, { avaliacaoId: 1, num_pergunta: 8, valor: 3 },
    { avaliacaoId: 1, num_pergunta: 9, valor: 2 }, { avaliacaoId: 1, num_pergunta: 10, valor: 3 }, 

    // AVALIAÇÃO 2 (João - Mês Passado) | Total: 22 | Sup: 9 | Inf: 13
    { avaliacaoId: 2, num_pergunta: 1, valor: 2 }, { avaliacaoId: 2, num_pergunta: 2, valor: 3 },
    { avaliacaoId: 2, num_pergunta: 3, valor: 2 }, { avaliacaoId: 2, num_pergunta: 4, valor: 2 }, 
    { avaliacaoId: 2, num_pergunta: 5, valor: 2 }, { avaliacaoId: 2, num_pergunta: 6, valor: 2 },
    { avaliacaoId: 2, num_pergunta: 7, valor: 2 }, { avaliacaoId: 2, num_pergunta: 8, valor: 3 },
    { avaliacaoId: 2, num_pergunta: 9, valor: 2 }, { avaliacaoId: 2, num_pergunta: 10, valor: 2 }, 

    // AVALIAÇÃO 3 (João - Hoje) | Total: 16 | Sup: 6 | Inf: 10
    { avaliacaoId: 3, num_pergunta: 1, valor: 1 }, { avaliacaoId: 3, num_pergunta: 2, valor: 1 },
    { avaliacaoId: 3, num_pergunta: 3, valor: 2 }, { avaliacaoId: 3, num_pergunta: 4, valor: 2 }, 
    { avaliacaoId: 3, num_pergunta: 5, valor: 2 }, { avaliacaoId: 3, num_pergunta: 6, valor: 1 },
    { avaliacaoId: 3, num_pergunta: 7, valor: 1 }, { avaliacaoId: 3, num_pergunta: 8, valor: 2 },
    { avaliacaoId: 3, num_pergunta: 9, valor: 2 }, { avaliacaoId: 3, num_pergunta: 10, valor: 2 }, 

    // AVALIAÇÃO 4 (Maria - Hoje) | Total: 28 | Sup: 11 | Inf: 17
    { avaliacaoId: 4, num_pergunta: 1, valor: 3 }, { avaliacaoId: 4, num_pergunta: 2, valor: 3 },
    { avaliacaoId: 4, num_pergunta: 3, valor: 3 }, { avaliacaoId: 4, num_pergunta: 4, valor: 2 }, 
    { avaliacaoId: 4, num_pergunta: 5, valor: 3 }, { avaliacaoId: 4, num_pergunta: 6, valor: 3 },
    { avaliacaoId: 4, num_pergunta: 7, valor: 3 }, { avaliacaoId: 4, num_pergunta: 8, valor: 2 },
    { avaliacaoId: 4, num_pergunta: 9, valor: 3 }, { avaliacaoId: 4, num_pergunta: 10, valor: 3 }, 

    // AVALIAÇÃO 5 (Carlos - Hoje) | Total: 12 | Sup: 4 | Inf: 8
    { avaliacaoId: 5, num_pergunta: 1, valor: 1 }, { avaliacaoId: 5, num_pergunta: 2, valor: 1 },
    { avaliacaoId: 5, num_pergunta: 3, valor: 1 }, { avaliacaoId: 5, num_pergunta: 4, valor: 1 }, 
    { avaliacaoId: 5, num_pergunta: 5, valor: 1 }, { avaliacaoId: 5, num_pergunta: 6, valor: 1 },
    { avaliacaoId: 5, num_pergunta: 7, valor: 2 }, { avaliacaoId: 5, num_pergunta: 8, valor: 1 },
    { avaliacaoId: 5, num_pergunta: 9, valor: 2 }, { avaliacaoId: 5, num_pergunta: 10, valor: 1 } 
];

// ==========================================
// 5. ALERTAS, SINTOMAS, EXAMES E MEDICAÇÃO
// ==========================================
export const alertasMock = [
    { id_utente: 1, id_medico: 1, id_avaliacao_origem: 3, tipo: 'AVISO - DETERIORAÇÃO CLÍNICA', prioridade: 'ALTA', estado: 'NOVO', motivo: 'Queda abrupta detetada! O score desceu de 26 para 16 pontos.', dataGeracao: hoje.toISOString() },
    { id_utente: 3, id_medico: 1, id_avaliacao_origem: 5, tipo: 'CRÍTICO - SCORE MUITO BAIXO', prioridade: 'ALTA', estado: 'PENDENTE', motivo: 'Score Total de 12. Intervenção médica recomendada.', dataGeracao: hoje.toISOString() },
    { id_utente: 1, id_medico: 1, id_avaliacao_origem: 2, tipo: 'AVISO - CONTROLO INSUFICIENTE', prioridade: 'MÉDIA', estado: 'FECHADO', motivo: 'Score ligeiramente abaixo do limiar (22).', dataGeracao: mesPassado.toISOString() }
];

export const sintomasMock = [
    { id_utente: 1, tipoSintoma: 'Falta de ar (Dispneia)', gravidade: 4, descricao: 'Dificuldade em respirar a subir escadas.', sintomaPresistente: true, dataSintoma: hoje.toISOString() },
    { id_utente: 1, tipoSintoma: 'Chiadeira no peito', gravidade: 3, descricao: 'Pieira audível durante a noite.', sintomaPresistente: false, dataSintoma: mesPassado.toISOString() },
    { id_utente: 2, tipoSintoma: 'Espirros', gravidade: 1, descricao: 'Espirros matinais ligeiros.', sintomaPresistente: false, dataSintoma: hoje.toISOString() },
    { id_utente: 3, tipoSintoma: 'Tosse com expetoração', gravidade: 4, descricao: 'Tosse produtiva intensa de manhã.', sintomaPresistente: true, dataSintoma: hoje.toISOString() }
];

export const medicacoesMock = [
    { id_utente: 1, nomeMedicacao: 'Budesonida + Formoterol', dose: '160/4.5 mcg', frequencia: '2 inalações, 2x ao dia', dataPrescricao: doisMesesAtras.toISOString() },
    { id_utente: 1, nomeMedicacao: 'Salbutamol', dose: '100 mcg', frequencia: 'Em caso de SOS (falta de ar)', dataPrescricao: mesPassado.toISOString() },
    { id_utente: 2, nomeMedicacao: 'Bilastina', dose: '20 mg', frequencia: '1 comprimido de manhã', dataPrescricao: hoje.toISOString() },
    { id_utente: 3, nomeMedicacao: 'Tiotrópio', dose: '18 mcg', frequencia: '1 inalação por dia', dataPrescricao: doisMesesAtras.toISOString() }
];

export const examesMock = [
    { id_utente: 1, tipoExame: 'Espirometria com Prova de Broncodilatação', dataSolicitacao: mesPassado.toISOString().split('T')[0], resultado: 'Obstrução moderada reversível.', concluido: true },
    { id_utente: 1, tipoExame: 'Raio-X Tórax', dataSolicitacao: hoje.toISOString().split('T')[0], resultado: null, concluido: false },
    { id_utente: 2, tipoExame: 'Testes de Sensibilidade Cutânea (Prick Test)', dataSolicitacao: doisMesesAtras.toISOString().split('T')[0], resultado: 'Positivo para Ácaros e Pêlo de Gato.', concluido: true },
    { id_utente: 3, tipoExame: 'TAC Torácica', dataSolicitacao: hoje.toISOString().split('T')[0], resultado: null, concluido: false }
];

export const intervencoesMock = [
    { id_utente: 1, id_medico: 1, notasMedicas: 'Utente não tem cumprido a medicação de manutenção. Explicada técnica inalatória.', acaoTomada: 'Reforço do ensino e prescrito Raio-X Tórax.', dataRegisto: hoje.toISOString() },
    { id_utente: 3, id_medico: 1, notasMedicas: 'Agravamento dos sintomas de DPOC. Suspeita de infeção respiratória.', acaoTomada: 'Prescrita antibioterapia e solicitada TAC urgente.', dataRegisto: hoje.toISOString() }
];

// ==========================================
// 6. LOGS DE AUDITORIA
// ==========================================
export const logsAuditoriaMock = [
    { id_utilizador: 1, tipoAcao: 'CREATE', entidadeAfetada: 'ConfiguracaoLimiares', id_registo_afetado: 1, valorNovo: '{"limiar_score": 24}', dataHora: doisMesesAtras.toISOString() },
    { id_utilizador: 2, tipoAcao: 'READ', entidadeAfetada: 'Ficha_Global_Utente', id_registo_afetado: 1, valorNovo: 'Médico consultou o histórico.', dataHora: mesPassado.toISOString() },
    { id_utilizador: 1, tipoAcao: 'CREATE', entidadeAfetada: 'Utilizador', id_registo_afetado: 6, valorNovo: '{"email":"carlos@mail.com"}', dataHora: hoje.toISOString() },
    { id_utilizador: 2, tipoAcao: 'UPDATE', entidadeAfetada: 'Alerta', id_registo_afetado: 3, valorNovo: '{"estado":"FECHADO"}', dataHora: hoje.toISOString() }
];