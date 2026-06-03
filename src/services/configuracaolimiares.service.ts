import { AppDataSource } from '../database/database';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { CreateConfiguracaoLimiaresDto } from '../dtos/configuracaoLimiares/create-configuracao.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class ConfiguracaoLimiaresService {
    private repo = AppDataSource.getRepository(ConfiguracaoLimiares);
    private logService = new LogAuditoriaService();

    async obterLimiarAtual(): Promise<number> {
        // Ordena pela chave primária (id_configuracao) para apanhar o último inserido
        const config = await this.repo.find({ 
            order: { id_configuracao: 'DESC' }, 
            take: 1 
        });
        
        const ultimaConfig = config[0];
        if (ultimaConfig?.limiar_score) {
           return ultimaConfig.limiar_score;
        }
        return 20;
    }

    async atualizarLimiar(dados: CreateConfiguracaoLimiaresDto, id_admin_que_alterou: number): Promise<ConfiguracaoLimiares> {
        const novaConfig = this.repo.create({
            limiar_score: dados.limiar_score,
            id_administrador: id_admin_que_alterou 
        });

        const configGuardada = await this.repo.save(novaConfig);

        await this.logService.registarLog({
            id_utilizador: id_admin_que_alterou,
            tipoAcao: 'CREATE',
            entidadeAfetada: 'ConfiguracaoLimiares',
            id_registo_afetado: configGuardada.id_configuracao,
            valorNovo: JSON.stringify({ limiar_score: configGuardada.limiar_score })
        });

        return configGuardada;
    }
}