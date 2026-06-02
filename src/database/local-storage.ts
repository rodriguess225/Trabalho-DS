// src/database/local-storage.ts
import { Exame } from '../models/exame.entity';
import { Prescricao } from '../models/prescricao.entity';

export const baseDeDadosLocal: Prescricao[] = [
    { id: 1, medicamento: "Aspirina", dose: "500mg", medico_nome: "Dr. House", dataCriacao: new Date() } as unknown as Prescricao
];

export const baseDeDadosExamesLocal: Exame[] = [
    { id: 1, nome: "RX Torax", codigo: "RX01", medico_nome: "Dr. House" } as unknown as Exame //as para evitar erros para já depois será retirado
];

export const baseDeDadosUsers: any[] = [];