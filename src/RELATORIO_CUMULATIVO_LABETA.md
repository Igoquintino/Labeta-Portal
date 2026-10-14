# Relatório Cumulativo de Registro e Padrões de Projeto (LABETA)

---

### **Entrada de Registro – 30/09/2026**
**Fase:** Concepção de Design, Identidade Visual e Arquitetura de Informação  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Identidade e Naming
* **Nome do Laboratório:** LABETA – Laboratório de Ecologia e Taxonomia de Algas
* **Assinatura / Slogan:** "Algas da Amazônia" (posicionado em destaque sob o logotipo no topo)[cite: 5, 10]
* **Conceito Estético:** Dark / Amazônia Noturna (Opção A)
* **Logotipo Base:** Vetor oficial circular com microscópio central, arabescos botânicos/diatomáceas e borda com inscrição institucional[cite: 5, 6, 9].

#### 2. Guia de Estilo & Paleta de Cores
* **Fundo Base:** `#0C120F` (Grafite Amazônico profundo)
* **Superfícies e Cards:** `#14241B` (Verde Noturno com bordas sutis)
* **Verde Institucional Primário:** `#165B33` (Verde oficial da marca)[cite: 6]
* **Dourado / Areia Aluvial:** `#D6C28F` (Bordas nobres, anel de microscópio, acentos)[cite: 6]
* **Verde Clorofila (Acento/Interação):** `#4EA86E` (Hover, badges e destaques)[cite: 6]
* **Tipografia:** `#F4F7F4` (Branco suave para leitura prolongada) e `#A0B0A4` (Textos de suporte)

#### 3. Arquitetura de Telas e Rotas (React)
1. **Home (`/`):**
   * **Hero:** Mosaico triplo com placeholders (*Bancada*, *Microscópio*, *Campo*) integrando o logotipo e o slogan.
   * **Sobre:** Apresentação institucional e missão científica.
   * **Regras do Laboratório (Acordeão):** EPIs obrigatórios em processos químicos/oxidação, vestimenta/biossegurança geral e higienização obrigatória de utensílios/lâminas para evitar contaminação.
   * **Mural de Notícias Recentes:** Bloco com os 3 artigos/notícias mais recentes.
   * **Carrossel de Navegação Rápida:** ~~Atalhos interativos para as páginas internas~~ *(modificado em 01/10/2026 para sistema com auto-avanço, detalhamento textual e pause-on-hover)*.
   * **Rodapé Institucional:** UFOPA – Unidade Tapajós (Bloco 1, Sala 5), Santarém - PA, contatos e copyright[cite: 1].
2. **Trabalhos (`/trabalhos`):** Separado em *Em Andamento* e *Concluídos* (com resumos e links externos)[cite: 2].
3. **Pessoas (`/pessoas`):** Grid de cards dos membros com fotos, nomes, funções e link para o Lattes[cite: 3].
4. **Laboratório (`/laboratorio`):** Duas colunas com foco nas instalações físicas e atividades práticas[cite: 4].
5. **Portal de Agendamento (`/agendamento`):**
   * Acesso restrito à comunidade acadêmica e pesquisadores vinculados à UFOPA.
   * Catálogo de equipamentos críticos (microscópios ópticos, lupas, estufas e bancadas).
   * Embed do Google Agenda (consulta de horários).
   * Embed do Google Formulários (solicitação de reserva).
6. **Notícias & Divulgação Científica (`/noticias`):**
   * Coluna 1: Comunicados internos do LABETA.
   * Coluna 2: Radar científico com artigos publicados em revistas/periódicos (DOI e link externo).

#### 4. Componentes Globais Interativos
* **Busca Global (Spotlight / `Ctrl + K`):** Modal translúcido com busca em tempo real por palavras-chave.
* **Modal de Contato Rápido:** Pop-up/span acionável sem trocar de tela.
* **Localização Interativa:** Google Maps responsivo no campus da UFOPA.

---

### **Entrada de Registro – 01/10/2026**
**Fase:** Engenharia de Agentes (Antigravity), Estrutura de Assets e Refinamento de UI  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Arquitetura de Agentes de IA no Antigravity
* **Pipeline com Dois Agentes Especialistas:**
  - **Agente 1 (UI & Semântica HTML5):** Focado estritamente na estrutura semântica, tags HTML5, acessibilidade WAI-ARIA e CSS Moderno via variáveis de `theme.css`.
  - **Agente 2 (Lógica & Integração):** Responsável pelo consumo de dados `.json`, estados de modais, atalhos de busca (`Ctrl + K`) e roteamento.
* **Economia de Tokens:** Implantação do arquivo `.agentcontext` na raiz do workspace com regras sintéticas invioláveis, eliminando reenvio contínuo de especificações.

#### 2. Tratamento de Logotipo e Iconografia
* **Padrão de Ativo Vetorial:** Adotado o formato de Asset Vetorial Estático em `public/`.
  - `public/logo-labeta.svg`: Vetor oficial colorido sem fundo, usado como emblema principal.
  - `public/logo-labeta-badge.svg`: Vetor oficial com fundo preservado para aplicações auxiliares[cite: 6].
* **Iconografia:** Uso da biblioteca `lucide-react` para elementos de interface (lupa, setas do carrossel, ícones de contato).

#### 3. Refinamento do Hero e Topo
* **Posicionamento do Emblema:** Em fidelidade ao rascunho de papel, o emblema circular centralizado flutua diretamente na intersecção inferior do mosaico de 3 fotos (bancada, microscopia, campo) com filtro `drop-shadow`[cite: 1, 7], conectando-se à assinatura "Algas da Amazônia"[cite: 5, 10] e ao bloco "Sobre o LABETA"[cite: 1].
* **Navbar:** Mantida com fundo translúcido, links semânticos, botão de busca (⌘K) e botão de contatos.

#### 4. Refinamento do Carrossel da Home
* **Mecânica de Transição:** Deslizamento horizontal contínuo (slide) com tempo automático de 5 segundos.
* **Acessibilidade e Controle:** Suporte a *pause-on-hover*, botões manuais laterais `<` e `>`[cite: 1] e barra de progresso dourada na base[cite: 6].
* **Conteúdo dos Cards:** Cada card (Trabalhos, Pessoas, Laboratório) contém título, breve parágrafo descritivo explicativo e botão de navegação direta[cite: 1, 2, 3, 4].

# Relatório Cumulativo de Registro e Padrões de Projeto (LABETA)

---

### **Entrada de Registro – 02/10/2026**
**Fase:** Modais Globais (Contatos e Spotlight), Validação de Atalhos e Página de Trabalhos  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Regra de Workspace no Antigravity
* Vinculada a regra de Workspace como ponteiro direto ao `.agentcontext`.
* Indexação otimizada por menção de arquivos `@` para consumo mínimo de tokens.

#### 2. Componentes Globais Finalizados
* **`ContactModal.jsx`:** Modal centralizado consumindo `members.json` com cópia rápida de e-mail, link para o Lattes e fechamento por Esc/backdrop.
* **`SpotlightSearch.jsx`:** Busca global com filtro por pílulas (*Todos*, *Membros*, *Trabalhos*, *Biossegurança*, *Notícias*), acionável pela Navbar e pelo atalho global `Ctrl + K` / `Cmd + K` (testado e aprovado com sucesso).

#### 3. Página de Trabalhos (`/trabalhos`)
* Estruturação de `src/data/works.json` dividido entre *Em Andamento* e *Concluídos*.
* Criação de `Works.jsx` com abas segmentadas, resumo técnico, tags metodológicas e links DOI/externos.

# Relatório Cumulativo de Registro e Padrões de Projeto (LABETA)

---

### **Entrada de Registro – 02/10/2026 (Parte 2)**
**Fase:** Página do Laboratório e Portal de Agendamento  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Página do Laboratório (`/laboratorio`)
* Layout em duas colunas homologado:
  - **Coluna 1:** Espaços Analíticos (Bancadas de Triagem, Sala de Microscopia, Área de Oxidação Química) com lista de equipamentos.
  - **Coluna 2:** Rotina Metodológica (Etapas 01 a 04 de pesquisa ficológica) e bloco de aviso de agendamento.

#### 2. Portal de Agendamento (`/agendamento`)
* Estruturação de `src/data/equipment.json` com catálogo de equipamentos críticos (microscópios, lupas, estufa, capela).
* Implementação de `Booking.jsx` com aviso de restrição acadêmica UFOPA, catálogo de disponibilidade e integração de calendário/formulário.

# Relatório Cumulativo de Registro e Padrões de Projeto (LABETA)

---

### **Entrada de Registro – 02/10/2026**
**Fase:** Conclusão do Core Frontend (Todas as Páginas, Modais e Mural)  
**Status:** Salvo e Homologado

#### 1. Componentes Globais e Modais
* **`ContactModal.jsx`:** Modal centralizado com cópia rápida de e-mail, link Lattes e fechamento por Esc/backdrop.
* **`SpotlightSearch.jsx`:** Busca global por pílulas com atalho global `Ctrl + K` / `Cmd + K`.

#### 2. Páginas Internas Finalizadas
* **`Works.jsx` (`/trabalhos`):** Produção científica categorizada entre *Em Andamento* e *Concluídos* com links DOI.
* **`People.jsx` (`/pessoas`):** Grid de membros com filtros de Coordenação, Pesquisadores e Discentes, linhas de pesquisa e Lattes.
* **`Lab.jsx` (`/laboratorio`):** Estrutura em duas colunas (Espaços Analíticos e Rotina Metodológica).
* **`Booking.jsx` (`/agendamento`):** Catálogo de equipamentos de precisão, aviso de restrição acadêmica UFOPA e painel de reservas.
* **`News.jsx` (`/noticias`):** Radar ficológico em duas colunas (Comunicados do LABETA e Radar Científico).

#### 3. Integração da Home
* **`RecentNewsSection.jsx`:** Mural de notícias integrado à Home, consumindo dinamicamente os dados de `news.json`.

Entrada de Registro – 08/10/2026

Fase: Diretriz Arquitetural para Administração Discreta e Sustentabilidade de Dados

Status: Aprovado e Registrado como Padrão do Projeto

1. Diagnóstico de Sustentabilidade do Software

Perfil de Tráfego: Volume acadêmico controlado (~100 acessos semanais por alunos, pesquisadores e parceiros externos).

Volatilidade de Dados: Baixa frequência de alterações. Equipamentos e membros mudam anualmente; trabalhos acadêmicos entram por semestre; comunicados/notícias a cada poucas semanas.

Critério Anti-Overengineering: Evitar a construção de uma API backend monolítica/restrita (Node/Java/Python) que exija servidores dedicados 24h, custos mensais de hospedagem ou manutenção constante de segurança quando a equipe técnica se formar.

Hospedagem Futura na UFOPA: O portal deve manter sua natureza estática/SPA para que o Centro de Tecnologia da Informação e Comunicação (CTIC/UFOPA) possa hospedá-lo sem burocracia técnica em servidores web convencionais (Nginx/Apache) sob o subdomínio labeta.ufopa.edu.br.

2. Arquitetura Escolhida: "Admin Invisível" com Supabase

Para atender à necessidade de a coordenação (professora) e bolsistas autorizados cadastrarem e editarem dados sem poluir a interface pública:

Experiência do Visitante Comum:

Não há botões públicos de "Login", "Entrar" ou "Painel Administrativo" expostos na Navbar.

Para o público externo, o portal funciona 100% como catálogo informativo e científico aberto.

Mecanismo de Autenticação Silenciosa:

Acesso via rota não indexada (ex.: /gestao-labeta) ou combinação de atalho via Spotlight (Ctrl + K -> :admin).

Autenticação via Google OAuth com a conta institucional da UFOPA (@ufopa.edu.br).

Lista de Permissões (Whitelist):

Tabela de controle de acessos gerenciada pelo Supabase:

create table administradores (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text default 'editor',
  created_at timestamp with time zone default now()
);


O sistema valida o e-mail logado contra essa lista. Se autorizado, o estado de administrador é validado e persistido com segurança.

Edição Contextual Direta (In-Place / Inline Editing):

Quando um administrador autenticado navega pelo portal, o React detecta a sessão e exibe botões discretos flutuantes de ação:

[ ✏️ Editar ] e [ 🗑️ Excluir ] diretamente nos cards de Notícias, Membros e Trabalhos.

[ ➕ Nova Notícia ] no topo da seção de Notícias.

Modais simples com formulários permitem alterar textos, datas e subir novas fotos com armazenamento no Supabase Storage.

3. Roteiro de Transição (Data-Driven Roadmap)

Etapa Atual (Frontend Estático Completo): Manter e validar todas as páginas com os arquivos locais em src/data/*.json.

Etapa Pré-Produção: Criar projeto gratuito no Supabase, espelhando a estrutura dos arquivos .json em tabelas relacionais (news, members, works, equipment).

Etapa de Integração: Substituir a importação local de .json por chamadas diretas via cliente @supabase/supabase-js com fallbacks para cache local.  