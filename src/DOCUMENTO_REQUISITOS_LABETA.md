# Documento de Especificação de Requisitos de Software (ERS)
## Projeto: Portal Web LABETA – Laboratório de Ecologia e Taxonomia de Algas

---

**Data de Emissão:** 30/09/2026  
**Versão:** 1.0  
**Status:** Homologado para Desenvolvimento  
**Instituição:** Universidade Federal do Oeste do Pará (UFOPA) – Unidade Tapajós, Bloco 1, Sala 5, Santarém-PA

---

## 1. Visão Geral do Projeto

O portal institucional do LABETA tem como propósito centralizar a divulgação científica, projetos de pesquisa taxonômica e ecológica de algas da região amazônica, além de fornecer um ambiente digital exclusivo para agendamento de bancadas e equipamentos críticos para a comunidade acadêmica vinculada.

---

## 2. Padrões de Identidade Visual e UI

* **Conceito Estético:** Dark / Amazônia Noturna (fundo escuro, alto contraste e acentos nobres).
* **Slogan Institucional:** "Algas da Amazônia"[cite: 5, 10].
* **Paleta Cromática Oficial:**
  - **Fundo Base (Background):** `#0C120F`
  - **Painéis e Cards (Surface):** `#14241B`
  - **Painéis Elevados:** `#1B3125`
  - **Verde Institucional Primário:** `#165B33`[cite: 6]
  - **Dourado / Areia Aluvial:** `#D6C28F`[cite: 6]
  - **Verde Clorofila (Acentos/Interação):** `#4EA86E`[cite: 6]
  - **Texto Principal:** `#F4F7F4`
  - **Texto Secundário / Muted:** `#A0B0A4`

---

## 3. Stack Tecnológica e Arquitetura Frontend

* **Core:** React 18+ com Vite.
* **Roteamento:** `react-router-dom` (estrutura SPA multi-rotas).
* **Estilização:** CSS Moderno nativo estruturado com variáveis CSS (`theme.css`) e regras escopadas.
* **Base de Dados Inicial:** Arquivos JSON locais modularizados (`members.json`, `works.json`, `news.json`), preparados para migração futura para API REST.

---

## 4. Requisitos Funcionais (RF)

* **RF01 – Página Inicial (Home):**
  - Hero com mosaico de 3 imagens (trabalho em bancada, microscopia, coleta de campo)[cite: 1] unificadas ao logotipo vetorizado circular[cite: 5, 6] e inscrição "Algas da Amazônia"[cite: 5, 10].
  - Bloco institucional "Sobre o LABETA"[cite: 1].
  - Acordeão interativo de Regras do Laboratório e Biossegurança.
  - Mural resumido com as 3 notícias/publicações mais recentes.
  - Carrossel de atalhos rápidos para as páginas internas (Trabalhos, Pessoas, Laboratório)[cite: 1].
* **RF02 – Página de Trabalhos (`/trabalhos`):**
  - Listagem categorizada entre "Trabalhos em Andamento" e "Trabalhos Concluídos"[cite: 2].
  - Exibição de título, resumo técnico, autores e links externos (artigo, repositório ou DOI)[cite: 2].
* **RF03 – Página de Pessoas (`/pessoas`):**
  - Grid responsivo de cards dos integrantes com foto, nome, papel no laboratório e link para o Currículo Lattes[cite: 3].
* **RF04 – Página do Laboratório (`/laboratorio`):**
  - Layout em duas colunas detalhando as instalações físicas e o cotidiano de pesquisas e atividades práticas[cite: 4].
* **RF05 – Portal de Agendamento (`/agendamento`):**
  - Mural com aviso de restrição à comunidade acadêmica vinculada.
  - Catálogo de equipamentos críticos (microscópios, lupas, estufas e bancadas).
  - Integração embed com Google Agenda para visualização de disponibilidade.
  - Integração embed com Google Formulários para submissão de solicitações.
* **RF06 – Página de Notícias e Radar Científico (`/noticias`):**
  - Coluna 1: Comunicados e notícias internas do LABETA.
  - Coluna 2: Radar Científico com destaques de artigos publicados em revistas e periódicos.
* **RF07 – Busca Global (Spotlight / `Ctrl + K`):**
  - Modal translúcido acionado por botão de lupa ou atalho de teclado.
  - Filtro em tempo real por palavras-chave (ex.: "diatomáceas") varrendo trabalhos, notícias, equipamentos e pesquisadores.
* **RF08 – Modal de Contatos Rápidos:**
  - Pop-up flutuante acionado pela Navbar sem recarregar ou trocar de página.
  - Listagem dos membros com canais de contato direto e cópia rápida de e-mail.
* **RF09 – Localização Interativa:**
  - Embed responsivo do Google Maps com marcador no campus da UFOPA (Unidade Tapajós).

---

## 5. Regras de Negócio e Biossegurança (RN)

* **RN01 – EPIs Mandatários em Oxidação:** Obrigatório o uso de jaleco, calça comprida, calçado fechado (bota ou tênis), luvas nitrílicas/látex e máscara apropriada durante processos de oxidação de amostras.
* **RN02 – Higienização Pós-Uso:** Obrigatória a lavagem e descontaminação imediata de todas as lâminas, vidrarias e utensílios após a sessão de trabalho para evitar contaminação cruzada.
* **RN03 – Elegibilidade de Agendamento:** Uso de infraestrutura e equipamentos restrito a docentes, discentes e pesquisadores vinculados à UFOPA ou projetos formais parceiros.

---

## 6. Requisitos Não Funcionais (RNF)

* **RNF01 – Semântica e Acessibilidade:** Estrutura baseada em HTML5 estrito (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) com suporte a atributos WAI-ARIA.
* **RNF02 – Responsividade:** Layout adaptável para desktop, tablets e dispositivos móveis (breakpoints principais em 768px e 1024px).
* **RNF03 – Performance:** Tempo de carregamento inicial otimizado, sem dependências de frameworks de estilização pesados.
* **RNF04 – Escalabilidade:** Componentes desacoplados, permitindo substituição imediata dos embeds pela API própria de agendamento.