export interface CreateMedicacaoDto {
    id_utente: number;
    id_intervencao_clinica: number; 
    nomeMedicacao: string;           
    dose: string;                    
    frequencia: string;              
    dataPrescricao?: string;         
    dataFinal?: string;              
}
