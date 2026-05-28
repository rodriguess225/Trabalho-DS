// src/database/local-storage.ts
import { Exame } from '../models/exame.entity';
import { Prescricao } from '../models/prescricao.entity';
import { Utente } from '../models/utente.entity'; // Certifica-te que importas o modelo

export const baseDeDadosLocal: Prescricao[] = [
    { id: 1, medicamento: "Aspirina", dose: "500mg", medico_nome: "Dr. House", dataCriacao: new Date() }
];

export const baseDeDadosExamesLocal: Exame[] = [
    { id: 1, nome: "RX Torax", codigo: "RX01", medico_nome: "Dr. House" }
];

export const baseDeDadosUsers: any[] = [
    {
        id: 1,
        nome: 'Paciente Exemplo',
        email: 'paciente@teste.pt',
        password: '$2a$10$algumaHashAqui', 
        numeroUtente: '123456789'
    }
];