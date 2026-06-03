// src/database/local-storage.ts
import { Exame } from '../models/exame.entity';




export const baseDeDadosExamesLocal: Exame[] = [
    { id: 1, nome: "RX Torax", codigo: "RX01", medico_nome: "Dr. House" } as unknown as Exame //as para evitar erros para já depois será retirado
];

export const baseDeDadosUsers: any[] = [];