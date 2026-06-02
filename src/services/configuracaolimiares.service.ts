import { AppDataSource } from '../database/database';
import { ConfiguracaoLimiares } from '../models/configuracaolimiares.entity';
import { CreateConfiguracaoDto } from '../dtos/configuracaoLimiares/create-configuracao.dto';
import { LogAuditoriaService } from './logauditoria.service';

export class ConfiguracaoLimiaresService {
    private repo = AppDataSource.getRepository(ConfiguracaoLimiares);
    private logService = new LogAuditoriaService();

    /**
     * Vai buscar o limiar atual do CARAT. 
     * Se não houver configuração na BD, assume o padrão clínico (ex: 20).
     */
    async obterLimiarAtual(): Promise<number> {
        // Ordena para ir buscar a configuração mais recente
        const config = await this.repo.find({ 
            order: { createdAt: 'DESC' }, 
            take: 1 
        });
        
        if (config.length > 0 && config[0].limiar_score) {
            return config[0].limiar_score;
        }
        return 20; // Padrão clínico: score <= 20 indica asma mal controlada
    }

    /**
     * Permite ao Administrador (UC11) atualizar as regras do sistema
     */
    async atualizarLimiar(dados: CreateConfiguracaoDto, id_admin_que_alterou: number): Promise<ConfiguracaoLimiares> {
        const novaConfig = this.repo.create({
            limiar_score: dados.limiar_score,
            id_administrador: id_admin_que_alterou // Guarda quem fez a alteração
        });

        const configGuardada = await this.repo.save(novaConfig);

        // Auditoria obrigatória (UC12)
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