import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { CreateUtenteDto } from '../dtos/utente/create-utente.dto';
import { UtenteResponseDto } from '../dtos/utente/utente-response.dto';

export class UtenteService {
    private repo = AppDataSource.getRepository(Utente);

    async criarUtente(dados: CreateUtenteDto): Promise<UtenteResponseDto> {
        const emailExiste = await this.repo.findOneBy({ email: dados.email });
        if (emailExiste) throw new Error("Email já registado.");

        const numeroExiste = await this.repo.findOneBy({ numeroUtente: dados.numeroUtente });
        if (numeroExiste) throw new Error("Nº Utente já registado.");

        const novoUtente = this.repo.create({ ...dados, dataCriacao: new Date() });
        const guardado = await this.repo.save(novoUtente);
        return this.toResponseDto(guardado);
    }

    async listarUtentes(): Promise<UtenteResponseDto[]> {
        const utentes = await this.repo.find();
        return utentes.map((utente) => this.toResponseDto(utente));
    }

    private toResponseDto(utente: Utente): UtenteResponseDto {
        return {
            id: utente.id, nome: utente.nome, email: utente.email,
            numeroUtente: utente.numeroUtente, dataNascimento: utente.dataNascimento,
            sexo: utente.sexo, telefone: utente.telefone, nif: utente.nif,
            morada: utente.morada, dataCriacao: utente.dataCriacao
        };
    }
}