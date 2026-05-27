Requisitos Funcionais
Os Requisitos Funcionais, são os requisitos que descrevem as funções, serviços e recursos que o sistema deve fornecer para atender às necessidades do utilizador.
Eles definem as tarefas, atividades e processos que o sistema deve realizar, bem como inputs, os resultados ou saídas (outputs) que ele deve produzir.
Para assegurar a clareza e facilitar a futura criação de testes de aceitação, estes requisitos foram documentados utilizando a estrutura "Dado / Quando / Então".
A tabela seguinte apresenta os Requisitos Funcionais, divididos pelas principais áreas de negócio do sistema:
Avaliação Clínica (CARAT)
ID
Nome
Descrição (Regra de negócio - Gherkin)
RF1
Realizar Avaliação CARAT
Dado que o utente está autenticado no sistema, quando acede à funcionalidade de nova avaliação, então o sistema deve apresentar o questionário do protocolo CARAT para recolha de dados clínicos.
RF2
Validar Respostas do Questionário
 Dado que o utente submete uma avaliação CARAT, quando existem perguntas obrigatórias não respondidas, então o sistema deve impedir a submissão e solicitar o preenchimento das respostas em falta.
RF3
Registar Avaliação no Sistema
Dado que uma avaliação CARAT foi submetida corretamente, quando o sistema valida os dados, então o sistema deve guardar a avaliação associada ao perfil do utente.
RF4
Calcular Score CARAT
Dado que uma avaliação foi registada, quando o sistema processa as respostas do questionário, então o sistema deve calcular automaticamente o score total da avaliação.
RF5
Calcular Sub-scores Respiratórios
 
Dado que o score CARAT está a ser calculado, quando o sistema analisa as respostas, então o sistema deve calcular separadamente os sub-scores de sintomas respiratórios superiores e inferiores.
RF6
Interpretar Nível de Controlo
 
Dado o score obtido na avaliação CARAT, quando comparado com os limiares definidos, então o sistema deve classificar o estado respiratório como: Controlado, Parcialmente controlado ou Não controlado.
RF7
Apresentar Resultado da Avaliação
 


Dado que o processamento da avaliação foi concluído, quando o resultado é apresentado ao utente, então o sistema deve mostrar o score, a classificação de controlo e as respetivas recomendações (educação para autocuidado, revisão terapêutica, sinais de alarme).
RF8
Registar Sintoma Diário
Dado que o utente está autenticado no sistema, quando acede à funcionalidade de reporte rápido, então o sistema deve permitir registar um sintoma específico (ex.: falta de ar) de forma isolada, sem a necessidade de preencher o questionário CARAT completo.


Sistema de Alertas Clínicos
ID
Nome
Descrição (Regra de negócio - Gherkin)
RF9
Gerar Alerta de Controlo Insuficiente
Dado que uma avaliação apresenta um score inferior ao limiar definido, quando a avaliação é registada, então o sistema deve gerar um alerta para o médico responsável.
RF10
Gerar Alerta de Deterioração


Dado que um utente realiza uma nova avaliação CARAT, quando o score apresenta uma diminuição igual ou superior ao valor Delta relativamente à avaliação anterior, então o sistema deve gerar um alerta de deterioração do estado respiratório.
RF11
Consultar Alertas
Dado que o médico está autenticado no sistema e acedeu à área de monitorização, quando solicita a visualização dos alertas ativos, então o sistema deve exibir uma lista de todos os alertas críticos ou informativos associados exclusivamente aos utentes sob a sua responsabilidade.
RF12
Atualizar Estado de Alerta
Dado que um alerta existe no sistema, quando o médico interage com ele, então o sistema deve permitir alterar o estado seguindo o fluxo: NOVO → VISTO → EM SEGUIMENTO → FECHADO.
RF13
Registar Notas e Ações de Intervenção
 
Dado que o médico interage com um alerta para atualizar o seu estado (ex.: transição para EM SEGUIMENTO ou FECHADO), quando introduz a descrição obrigatória das ações clínicas tomadas (ex.: ajuste de medicação, marcação de exames ou conselhos de autocuidado), então o sistema deve registar essa nota clínica, associando-a permanentemente ao alerta e ao histórico de intervenções do utente.
RF14
Gerar Alerta de Intervenção Clínica
 
Dado que o sistema analisa os sintomas reportados (persistentes) e a medicação ativa de um utente, quando deteta indicadores de necessidade de revisão terapêutica ou exames, então o sistema deve gerar um alerta automático de intervenção para o médico responsável.







Dashboard e Visualização
ID
Nome
Descrição (Regra de negócio- Gherkin)
RF15
Visualizar Histórico de Avaliações
Dado que o utente está autenticado e acedeu à área de "Histórico de Avaliações", quando solicita a visualização do histórico do questionário CARAT, então o sistema deve apresentar uma lista de todas as avaliações submetidas anteriormente.
RF16
Apresentar Gráfico de Evolução
Dado que existem avaliações registadas, quando o utente consulta o dashboard, então o sistema deve apresentar um gráfico temporal com a evolução dos scores.
RF17
Mostrar Limiar de Controlo no Gráfico
Dado que o gráfico de evolução é apresentado, quando os scores são visualizados, então o sistema deve incluir uma linha representando o limiar de controlo insuficiente.
RF18
Consulta Clínica pelo Médico
Dado que o médico está autenticado e seleciona um utente da sua lista de pacientes, quando solicita a consulta do histórico clínico detalhado, então o sistema deve apresentar de forma consolidada o histórico de scores CARAT, alertas gerados, medicação e exames.
RF19
Visualizar Alertas no Dashboard (Utente) 

 
Dado que o utente consulta o seu dashboard principal, quando existem alertas de deterioração ou controlo insuficiente ativos, então o sistema deve exibir visualmente esses alertas para informar o utente sobre o agravamento do seu estado.



Administração e Configuração do Sistema

ID
Nome
Descrição (Regra de negócio- Gherkin)
RF20
Gerir Utilizadores
Dado que o administrador está autenticado no sistema, quando acede à funcionalidade de gestão de utilizadores, então o sistema deve permitir realizar as operações de CRUD (criar, consultar, atualizar e inativar) nos registos de médicos e utentes.
RF21
Associar Médico a Utente
Dado que um novo utente é registado, quando o registo é concluído, então o sistema deve associar o utente a um médico responsável.
RF22
Configurar Limiares Clínicos
Dado que o administrador está autenticado no sistema, quando acede ao painel de configurações clínicas, então o sistema deve permitir definir e atualizar os indicadores e regras clínicas (ex.: sintomas persistentes, combinações de medicação, limites de valores) utilizados para a geração automática de alertas.
RF23
Gestão de Dados Simulados
Dado que o administrador necessita de testar o comportamento do sistema, quando utiliza a funcionalidade de gestão de dados, então o sistema deve permitir carregar e atualizar dados simulados (seed) de avaliações e alertas.
RF24
Atualização de Dados Pessoais 

 
Dado que o utente está autenticado no sistema, quando acede à funcionalidade de perfil e altera a sua informação de contacto ou dados biográficos, então o sistema deve validar e persistir as alterações, respeitando as regras de negócio e permissões definidas.



RF25
Gestão de Informação Clínica

 
Dado que o médico está autenticado no sistema, quando regista ou atualiza dados clínicos de um utente, tais como medicação ou exames, então o sistema deve guardar essa informação associada ao perfil do utente para permitir a consulta histórica.
RF26
Gestão de Perfis e Permissões 

 
Dado que o administrador gere as configurações de uma conta de utilizador, quando altera o perfil de acesso para um dos papéis válidos (Utente, Médico ou Administrador), então o sistema deve redefinir instantaneamente as permissões de acesso e restringir as funcionalidades e visualização de dados de acordo com o seu papel.



Requisitos Não Funcionais
Os Requisitos Não Funcionais são os requisitos que descrevem as características do sistema que não estão relacionadas às suas funcionalidades.
Eles descrevem como o sistema deve desempenhar suas funções, ou seja, como ele deve se comportar em relação a aspectos como desempenho, segurança, confiabilidade, usabilidade, escalabilidade, entre outros. 
Os requisitos não funcionais geralmente concentram-se em aspectos técnicos do sistema e são muitas vezes expressos em termos de métricas ou padrões específicos.
Para garantir a qualidade, a segurança e a viabilidade técnica da solução, a especificação dos requisitos não funcionais foi estruturada de acordo com o modelo FURPS+ e estão representados nas tabelas abaixo da mesma forma:
F (Funcionalidade/Functionality): Especifica as funcionalidades que não se relacionam com os casos de uso.
U (Usabilidade/Usability): Avalia a interface com o utilizador.
R (Confiabilidade/Reliability): Integridade, conformidade e interoperabilidade do software.
P (Desempenho/Performance): Avalia os requisitos de desempenho do software.
S (Suportabilidade/Supportability): Testabilidade e facilidade de manutenção.
+ (Restrições): Limitações de design e tecnológicas impostas.

Funcionalidade (Functionality)

ID
Atributo
Descrição
RNF-F1
Autenticação e Autorização
O sistema deve garantir que o acesso aos dados é feito via token ou sessão. Adicionalmente, deve aplicar um controlo de acesso baseado no perfil do utilizador (Utente, Médico, Administrador), garantindo a privacidade dos dados clínicos.
RNF-F2
Auditoria/Logs
O sistema deve manter um registo (log) de todas as criações e alterações de dados, indicando inequivocamente o autor, a data e a hora de cada operação.
RNF-F3 
Interoperabilidade
A API deve utilizar o formato JSON e/ou XML (com XSD) para a troca de dados, estabelecendo contratos (schemas) claros para a validação de mensagens (payloads).
RNF-F4
Separação de Dados
O sistema deve implementar uma segregação lógica entre os dados administrativos e os dados de saúde privados (como scores e notas clínicas), em conformidade com as decisões de desenho do projeto.


Usabilidade (Usability)

ID
Atributo
Descrição
RNF-U1
Eficiência de Uso
O questionário CARAT deve ser intuitivo e eficiente, permitindo a sua conclusão pelo utente num tempo máximo de 5 minutos.
RNF-U2
Experiência do Dashboard
A interface do dashboard deve ser responsiva (adaptável a diferentes dimensões de ecrã) e apresentar a informação de forma visualmente clara e imediata, permitindo ao utente responder rapidamente às questões sobre o seu estado atual ("Como estou?"), a sua evolução clínica ("Estou a piorar?") e as ações recomendadas ("O que devo fazer agora?").
RNF-U3
Prevenção de Erros
O sistema deve implementar validações de input consistentes em todos os endpoints da API e nas interfaces de utilizador. Deve garantir um tratamento de erros uniforme, devolvendo mensagens claras e informativas (evitando falhas silenciosas), sempre que forem submetidos dados inválidos ou mal formatados, conforme as diretrizes da checklist técnica do projeto.





Confiabilidade (Reliability)

ID
Atributo
Descrição
RNF-C1
Integridade de Dados
O sistema deve garantir que o cálculo do score CARAT é exato, assegurando que os resultados não sofrem corrupção ou perda de informação durante o processo de persistência na base de dados.
RNF-C2
Tratamento de Exceções
O sistema deve possuir um tratamento de erros consistente em toda a API, prevenindo falhas críticas (crashes) do servidor perante inputs mal formatados


Desempenho (Performance)

ID
Atributo
Descrição
RNF-P1
Tempo de Resposta
O sistema deve garantir que a API responde aos pedidos de consulta (ex.: histórico de scores ou alertas) em menos de 1 segundo, sob condições normais.
RNF-P2
Processamento Assíncrono
A geração de alertas deve ser calculada de imediato no servidor (Web API) no momento em que uma avaliação CARAT é registada.
RNF-P3
Capacidade
O sistema deve suportar múltiplos acessos simultâneos (ex.: 50 utilizadores) sem degradação do tempo de resposta.

Suportabilidade (Supportability)

ID
Atributo
Descrição
RNF-S1
Instabilidade e Setup
O projeto deve incluir seeds de dados para a instalação e execução do sistema.
RNF-S2
Normas de Código
O código-fonte deve respeitar regras de formatação e linting para garantir a manutenção pela equipa.
RNF-S3
Testabilidade
O código deve ser estruturado de forma a permitir testes, e a API deve poder ser integralmente testada através de uma Coleção Postman exportada.

Restrições Técnicas / Design (+)

ID
Atributo
Descrição
RNF-T1
Restrição de Backend
A Web API tem de ser desenvolvida, obrigatoriamente, em ambiente Node.js utilizando a framework Express.
RNF-T2
Restrição de Persistência
Os dados devem ser armazenados, obrigatoriamente, numa base de dados relacional, limitando a escolha a SQLite, PostgreSQL ou MySQL.
RNF-T3
Restrição de Frontend
A aplicação cliente responsável por consumir a API deve ser desenvolvida com recurso a uma das tecnologias permitidas: Web básica (HTML/JS), biblioteca React ou Interface de Linha de Comandos (CLI).
RNF-T4
Entrega e Configuração
O repositório do projeto deve incluir scripts de migração de base de dados (migrations), rotinas de carregamento de dados simulados (seeds) e um ficheiro estruturado (README.md) com as instruções exatas para a instalação, configuração e execução da aplicação nos diferentes ambientes.

