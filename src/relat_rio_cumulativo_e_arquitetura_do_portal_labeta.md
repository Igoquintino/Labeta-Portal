# Relatório Cumulativo de Registro e Padrões de Projeto (LABETA)

---

### **Entrada de Registro – 30/09/2026**
**Fase:** Concepção de Design, Identidade Visual e Arquitetura de Informação  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Identidade e Naming
* **Nome do Laboratório:** LABETA – Laboratório de Ecologia e Taxonomia de Algas
* **Afiliação:** UFOPA (Universidade Federal do Oeste do Pará – Campus Tapajós)
* **Assinatura / Slogan:** "Algas da Amazônia" (sob a marca no cabeçalho)
* **Conceito Estético:** Dark / Amazônia Noturna
* **Logotipo Base:** Vetor circular com microscópio central, arabescos botânicos e borda institucional.

#### 2. Guia de Estilo & Paleta de Cores (`theme.css`)
* **Fundo Base (`--bg-primary`):** `#0C120F` (Grafite Amazônico Profundo)
* **Superfícies e Cards (`--bg-surface`):** `#14241B` (Verde Noturno)
* **Superfícies Elevadas (`--bg-surface-elevated`):** `#1B3125`
* **Verde Institucional Primário (`--color-brand`):** `#165B33`
* **Dourado / Areia Aluvial (`--color-gold`):** `#D6C28F`
* **Verde Clorofila / Acento (`--color-accent`):** `#4EA86E`
* **Tipografia Principal:** `#F4F7F4` (Texto claro) e `#A0B0A4` (Texto secundário)

---

### **Entrada de Registro – 01/10/2026**
**Fase:** Engenharia de Agentes (Antigravity), Assets e Componentes da Home  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Ambiente de Agentes no Antigravity
* Configuração do `.agentcontext` na raiz com diretrizes semânticas e cores oficiais.
* Criação de regra de Workspace conectando ponteiro direto ao `.agentcontext`.
* Separação de papéis:
  * `[UI]`: Marcação semântica HTML5, acessibilidade ARIA e CSS modular.
  * `[Lógica]`: Estados React, rotas e consumo de arquivos de dados estruturados (`.json`).

#### 2. Componentes da Página Inicial (`Home.jsx`)
* **`HeroMosaic.jsx`:** Mosaico de 3 fotos (bancada, microscopia, campo) com emblema circular centralizado e flutuante.
* **`AboutSection.jsx`:** Apresentação institucional com divisores vetoriais em ondas douradas.
* **`RulesSection.jsx`:** Normas de biossegurança e EPIs com suporte a `<details>` e `<summary>`.
* **`CarouselNavigation.jsx`:** Carrossel dinâmico com auto-avanço de 5s, pausa ao passar o cursor, setas laterais e barra de progresso dourada.

---

### **Entrada de Registro – 02/10/2026**
**Fase:** Conclusão do Core Frontend, Modais Globais e Responsividade  
**Status:** Salvo e Homologado pelo Usuário

#### 1. Componentes Globais e Modais
* **`Navbar.jsx` & `Navbar.css`:**
  * Navegação semântica desktop com destaque ativo.
  * Responsividade móvel e tablet (≤ 900px): gaveta hambúrguer retrátil, logotipo perfeitamente centralizado via CSS Grid (`auto 1fr auto`), e botão de contatos compacto com ícone `<Users size={16} />`.
* **`ContactModal.jsx`:** Modal centralizado flutuante consumindo `members.json`, cópia rápida de e-mail institucional com feedback ("Copiado!"), atalho Lattes e fechamento por `Esc`/backdrop.
* **`SpotlightSearch.jsx`:** Busca global rápida acionada por `Ctrl + K` / `Cmd + K`, filtro por pílulas (*Todos*, *Membros*, *Trabalhos*, *Biossegurança*, *Notícias*) e botão `ESC` com alternância para ícone `✕` no hover e fixo em telas móveis (≤ 900px).
* **`Footer.jsx`:** Rodapé institucional com links rápidos e créditos da UFOPA.

#### 2. Páginas Internas Finalizadas
* **`Works.jsx` (`/trabalhos`):** Produção científica categorizada dinamicamente entre *Em Andamento* e *Concluídos*, tags de metodologia ficológica e links para DOI.
* **`People.jsx` (`/pessoas`):** Grade responsiva de pesquisadores com abas de filtro (*Coordenação*, *Pesquisadores*, *Discentes*), linhas de investigação, biografias e fallback de avatar.
* **`Lab.jsx` (`/laboratorio`):** Visão física em 2 colunas:
  * Coluna 1: Espaços Analíticos (Bancadas, Sala de Microscopia, Área de Oxidação).
  * Coluna 2: Rotina Metodológica (Passos 01 a 04 de preparo ficológico) e aviso de agendamento.
* **`Booking.jsx` (`/agendamento`):** Portal acadêmico de agendamento restrito à comunidade UFOPA com catálogo de equipamentos críticos e área preparada para formulário/Google Agenda.
* **`News.jsx` (`/noticias`):** Radar ficológico em 2 colunas paralelas:
  * Coluna 1: Comunicados internos e editais PIBIC do LABETA.
  * Coluna 2: Radar Científico com resumo de artigos publicados em periódicos indexados.
* **`RecentNewsSection.jsx`:** Integração na `Home.jsx` consumindo automaticamente as 3 publicações mais recentes de `news.json`.

---

### **Entrada de Registro – 08/10/2026**
**Fase:** Diretriz Arquitetural para Administração Discreta e Sustentabilidade de Dados  
**Status:** Aprovado e Registrado como Padrão do Projeto

#### 1. Diagnóstico de Sustentabilidade do Software
* **Perfil de Tráfego:** Volume acadêmico controlado (~100 acessos semanais por alunos, pesquisadores e parceiros externos).
* **Volatilidade de Dados:** Baixa frequência de alterações. Equipamentos e membros mudam anualmente; trabalhos acadêmicos entram por semestre; comunicados/notícias a cada poucas semanas.
* **Critério Anti-Overengineering:** Evitar a construção de uma API backend monolítica/restrita (Node/Java/Python) que exija servidores dedicados 24h, custos mensais de hospedagem ou manutenção constante de segurança quando a equipe técnica se formar.
* **Hospedagem Futura na UFOPA:** O portal deve manter sua natureza estática/SPA para que o Centro de Tecnologia da Informação e Comunicação (CTIC/UFOPA) possa hospedá-lo sem burocracia técnica em servidores web convencionais (Nginx/Apache) sob o subdomínio `labeta.ufopa.edu.br`.

#### 2. Arquitetura Escolhida: "Admin Invisível" com Supabase
Para atender à necessidade de a coordenação (professora) e bolsistas autorizados cadastrarem e editarem dados sem poluir a interface pública:

* **Experiência do Visitante Comum:**
  * Não há botões públicos de "Login", "Entrar" ou "Painel Administrativo" expostos na Navbar.
  * Para o público externo, o portal funciona 100% como catálogo informativo e científico aberto.

* **Mecanismo de Autenticação Silenciosa:**
  * Acesso via rota não indexada (ex.: `/gestao-labeta`) ou combinação de atalho via Spotlight (`Ctrl + K` -> `:admin`).
  * Autenticação via Google OAuth com a conta institucional da UFOPA (`@ufopa.edu.br`).

* **Lista de Permissões (Whitelist):**
  * Tabela de controle de acessos gerenciada pelo Supabase:
    ```sql
    create table administradores (
      id uuid primary key default uuid_generate_v4(),
      email text unique not null,
      role text default 'editor',
      created_at timestamp with time zone default now()
    );
    ```
  * O sistema valida o e-mail logado contra essa lista. Se autorizado, o estado de administrador é validado e persistido com segurança.

* **Edição Contextual Direta (In-Place / Inline Editing):**
  * Quando um administrador autenticado navega pelo portal, o React detecta a sessão e exibe botões discretos flutuantes de ação:
    * `[ ✏️ Editar ]` e `[ 🗑️ Excluir ]` diretamente nos cards de Notícias, Membros e Trabalhos.
    * `[ ➕ Nova Notícia ]` no topo da seção de Notícias.
  * Modais simples com formulários permitem alterar textos, datas e subir novas fotos com armazenamento no Supabase Storage.

#### 3. Roteiro de Transição (Data-Driven Roadmap)
1. **Etapa Atual (Frontend Estático Completo):** Manter e validar todas as páginas com os arquivos locais em `src/data/*.json`.
2. **Etapa Pré-Produção:** Criar projeto gratuito no Supabase, espelhando a estrutura dos arquivos `.json` em tabelas relacionais (`news`, `members`, `works`, `equipment`).
3. **Etapa de Integração:** Substituir a importação local de `.json` por chamadas diretas via cliente `@supabase/supabase-js` com fallbacks para cache local.