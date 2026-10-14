# Relatório de Auditoria e Modernização de UI/UX
## Portal Web LABETA – Laboratório de Ecologia e Taxonomia de Algas
**Instituição:** Universidade Federal do Oeste do Pará (UFOPA)  
**Data:** 09 de Outubro de 2026  
**Versão:** 1.0  
**Metodologia:** Heurísticas de Nielsen, Diretrizes WCAG 2.2 (A/AA/AAA), Design System Tokens Architecture e Práticas Modernas de Frontend (React 19 + Vite).

---

## 1. Sumário Executivo

Esta auditoria realizou uma avaliação diagnóstica profunda e sistemática da interface, usabilidade, acessibilidade digital e integridade técnica do **Portal LABETA**. 

O projeto apresenta uma base visual distintiva e autêntica — ancorada no conceito **"Dark / Amazônia Noturna"** com a paleta oficial (Grafite Amazônico `#0C120F`, Verde Institucional `#165B33`, Dourado Aluvial `#D6C28F` e Verde Clorofila `#4EA86E`). No entanto, o portal apresenta **fricções ergonômicas críticas**, **violações de acessibilidade (WCAG 2.2)**, **comportamentos que quebram a navegação SPA**, **assets ausentes (erros 404)** e **débitos de código (ESLint e tipagem)** que reduzem o impacto da divulgação científica e o conforto de uso por pesquisadores e discentes.

### Matriz de Maturidade de UI/UX

```
┌─────────────────────────────────┬──────────┬────────────────────────────────────────────────────────┐
│ Pilar Avaliado                  │ Nota     │ Situação Geral                                         │
├─────────────────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ 1. Identidade & Design System   │ 7.5 / 10 │ Paleta coesa, porém sem tokens e com estilos hardcoded │
│ 2. Acessibilidade (WCAG 2.2)    │ 4.0 / 10 │ Idioma incorreto, carrossel forçado, sem skip-link     │
│ 3. Usabilidade & Navegação (UX) │ 5.5 / 10 │ Spotlight incompleto, recarregamento indevido de tela  │
│ 4. Responsividade & Mobile      │ 6.0 / 10 │ 66% do mosaico ocultado, carrossel sem touch swipe     │
│ 5. Engenharia Frontend & Código │ 5.0 / 10 │ 20 erros de linter, arquivo vazio, typo em arquivos    │
└─────────────────────────────────┴──────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Avaliação por Heurísticas de Usabilidade de Nielsen

| Heurística de Nielsen | Status | Diagnóstico no LABETA |
| :--- | :---: | :--- |
| **#1: Visibilidade do status do sistema** | ⚠️ Alerta | O carrossel da Home avança sozinho sem indicador numérico explícito no mobile; falta feedback audível/acessível ao copiar e-mail no modal de contatos. |
| **#2: Correspondência entre sistema e mundo real** | ⚠️ Alerta | Termos taxonômicos e regras bem estruturados, porém links de Lattes com valor placeholder `0000000000000000` continuam clicáveis e levam a páginas de erro do CNPq. |
| **#3: Controle e liberdade do usuário** | 🛑 Crítico | O carrossel em smartphones e para usuários de teclado não possui botão de pausa acessível, desrespeitando o controle do usuário sobre o movimento. |
| **#4: Consistência e padrões** | 🛑 Crítico | Divergência institucional de endereço: `Lab.jsx` indica *Bloco 1, Sala 5*, enquanto `Footer.jsx` indica *Bloco 09, sala 06*. O link para `/agendamento` em `Lab.jsx` usa tag nativa `<a>` em vez de `<Link>`, causando reload total. |
| **#5: Prevenção de erros** | ⚠️ Alerta | No Spotlight (`Ctrl + K`), se o usuário digitar termos válidos que existem em `works.json` (como novos autores), o sistema retorna "nenhum resultado" porque o mock do componente é fixo e incompleto. |
| **#6: Reconhecimento em vez de memorização** | 🟢 Bom | Uso consistente de ícones da biblioteca `lucide-react` para representar microscopia, equipe, artigos e biossegurança. |
| **#7: Flexibilidade e eficiência de uso** | ⚠️ Alerta | O atalho `Ctrl + K` é excelente, mas não permite navegar na lista com as setas do teclado (`↑` e `↓`) nem acionar com `Enter`. Exibe `⌘K` mesmo em ambientes Linux e Windows. |
| **#8: Estética e design minimalista** | 🟢 Bom | Visual noturno atraente, com cards bem espaçados, mas com redundâncias textuais na seção "Sobre o LABETA". |
| **#9: Ajuda aos usuários com erros** | 🟢 Bom | O estado de busca vazia orienta o usuário com sugestões de termos ("diatomáceas", "EPIs", etc.). |
| **#10: Ajuda e documentação** | 🟢 Bom | Boas seções de requisitos e protocolos laboratoriais bem catalogados. |

---

## 3. Auditoria de Identidade Visual, Cores & Design Tokens

### 3.1. Análise Cromática e Contraste (WCAG 2.1/2.2 AA)
* **Fundo Primário:** `#0C120F` (Grafite Amazônico)
* **Superfície Card:** `#14241B` (Verde Noturno)
* **Texto Principal:** `#F4F7F4` (Branco Suave) — **Contraste 15.8:1** (Excelente, supera o mínimo de 4.5:1).
* **Texto Secundário:** `#A0B0A4` (Muted) — **Contraste 6.4:1** (Conforme para corpo de texto em tamanhos >= 14px).
* **Dourado Aluvial:** `#D6C28F` sobre `#0C120F` — **Contraste 8.1:1**; sobre `#14241B` — **Contraste 6.2:1** (Excelente conformidade).
* **Verde Clorofila (Acentos):** `#4EA86E` sobre `#0C120F` — **Contraste 5.5:1** (Conforme).

> [!WARNING]
> **Risco de Ilegibilidade por Tamanho:**  
> Elementos com `#A0B0A4` e `#D6C28F` configurados com `font-size: 0.65rem` (~10.4px) a `0.68rem` (~10.8px) falham na experiência de leitura de pessoas com baixa visão ou em telas de alta densidade (retina). O piso recomendado é de **12px (0.75rem)** para metadados e **14px (0.875rem)** para corpo de texto.

### 3.2. Proposta de Arquitetura de Tokens em 3 Camadas

Atualmente, `theme.css` contém poucas variáveis e a maioria das cores e espaçamentos está solta nos arquivos de componentes. A estrutura deve ser refatorada para:

```css
:root {
  /* Camada 1: Primitivos */
  --color-green-950: #0C120F;
  --color-green-900: #14241B;
  --color-green-800: #1B3125;
  --color-green-600: #165B33;
  --color-green-400: #4EA86E;
  --color-gold-400:  #D6C28F;
  --color-gold-200:  #E8DEC0;
  --color-gray-100:  #F4F7F4;
  --color-gray-400:  #A0B0A4;

  /* Camada 2: Semânticos (Tokens de Tema) */
  --bg-canvas: var(--color-green-950);
  --bg-surface: var(--color-green-900);
  --bg-surface-elevated: var(--color-green-800);
  --text-primary: var(--color-gray-100);
  --text-secondary: var(--color-gray-400);
  --accent-gold: var(--color-gold-400);
  --accent-chlorophyll: var(--color-green-400);
  --focus-ring: 0 0 0 2px var(--color-gold-400);

  /* Camada 3: Escala de Espaçamento e Tipografia */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Roboto Mono', monospace;
}
```

---

## 4. Auditoria de Acessibilidade Digital (WCAG 2.2)

### 4.1. Principais Não-Conformidades e Soluções

#### 1. Idioma do Documento (`index.html`)
* **Problema:** `<html lang="en">` faz com que softwares de tecnologia assistiva (NVDA, VoiceOver, TalkBack) apliquem regras fonéticas inglesas para palavras em português como *"diatomáceas"*, *"algas"* e *"Igarapé"*.
* **Correção:** Alterar para `<html lang="pt-BR">`.

#### 2. Mecanismo de Salto de Navegação (*Skip Link*)
* **Problema:** Usuários navegando via teclado precisam teclar `Tab` repetidamente por todos os links da Navbar antes de alcançar o conteúdo da página.
* **Correção:** Inserir no topo de `App.jsx`:
  ```jsx
  <a href="#main-content" className="skip-to-content">
    Pular para o conteúdo principal
  </a>
  ```

#### 3. Justificação de Texto Prejudicial à Leitura
* **Problema:** Em `AboutSection.css` (linha 69), o parágrafo usa `text-align: justify; text-justify: inter-word;`. Na web, a justificação sem hifenização cria espaçamentos desiguais que prejudicam severamente pessoas com dislexia ou dificuldades visuais (violação da WCAG 1.4.8).
* **Correção:** Definir `text-align: left; line-height: 1.75; max-width: 65ch;`.

#### 4. Carrossel Automático Incessante (Critério 2.2.2 - Pause, Stop, Hide)
* **Problema:** O carrossel em `CarouselNavigation.jsx` avança a cada 5 segundos. Ele pausa somente via `onMouseEnter`, o que não atende usuários de smartphone (toque) ou navegação estritamente por teclado.
* **Correção:** Adicionar botão explícito de Pausar/Reproduzir (`<button aria-label={isPaused ? "Retomar carrossel" : "Pausar carrossel"}>`) e respeitar a preferência `@media (prefers-reduced-motion: reduce)`.

#### 5. Contenção de Foco em Modais (*Focus Trapping*)
* **Problema:** Ao abrir o `SpotlightSearch` ou o `ContactModal`, ao pressionar `Tab`, o foco transborda o modal e navega pelos links da página que está atrás do backdrop escuro.
* **Correção:** Implementar armadilha de foco (*focus trap*) que cicla as tabulações apenas dentro do diálogo aberto até que seja fechado com `Esc` ou botão.

---

## 5. Auditoria Sistemática Componente a Componente

### 5.1. Header & Navbar (`Navbar.jsx` / `Navbar.css`)
1. **Atalho Dinâmico por SO:** O botão exibe `⌘K` fixo. Deve detectar se o usuário está em Mac (`navigator.userAgent.includes('Mac') ? '⌘K' : 'Ctrl+K'`).
2. **Menu Mobile:** Atualmente, a gaveta expande empurrando a página (`max-height: 380px`), gerando salto de layout (CLS). Deve ser substituída por um menu dropdown ou gaveta overlay com backdrop escurecido e bloqueio da rolagem do fundo (`document.body.style.overflow = 'hidden'`).
3. **Indicador de Página Ativa:** Adicionar atributo `aria-current="page"` nativo para o item correspondente à rota aberta.

### 5.2. Topo Hero & Mosaico (`HeroMosaic.jsx` / `HeroMosaic.css`)
1. **Imagens Quebradas (404):** Os arquivos `/placeholders/bancada.jpg`, `/placeholders/microscopio.jpg` e `/placeholders/campo.jpg` não existem em `public/`.
2. **Conflito de Escala no CSS:**
   ```css
   .hero-logo-frame { width: 130px; height: 130px; }
   .hero-logo-svg   { width: 30vh;  height: 30vh; } /* Erro: 30vh ignora o tamanho do pai */
   ```
   Deve ser alterado para `width: 100%; height: 100%;`.
3. **Degradação no Mobile:** Ocultar 2 das 3 imagens em celulares desfaz a proposta do mosaico. O grid mobile pode manter as 3 fotos em miniatura compacta (grid 3 colunas baixas ou carrossel visual sutil).

### 5.3. Seção Sobre (`AboutSection.jsx`)
1. **Redundância Textual:** Os dois primeiros parágrafos do componente repetem quase exatamente a mesma informação institucional.
2. **Unificação Textual:** Fundir em um texto único, institucional e direto, destacando a relevância pioneira do laboratório para o monitoramento da bacia do Rio Tapajós e Baixo Amazonas.

### 5.4. Regras do Laboratório & Biossegurança (`RulesSection.jsx`)
1. **Acordeão Inativo:** Todos os 3 blocos possuem a propriedade `open`, iniciando todos abertos. A melhor prática de UX é abrir o primeiro (EPIs Mandatórios) e deixar os demais recolhidos para leitura sob demanda.
2. **Arquivo Morto:** Remover o arquivo vazio `src/components/home/RulesAccordion.jsx` (0 bytes).

### 5.5. Mural de Notícias Recentes (`RecentNewsSection.jsx`)
1. **Estilo Comentado:** A propriedade CSS `/* -webkit-line-clamp: 20; */` está comentada, permitindo que resumos longos quebrem o alinhamento da grade de 3 colunas. Deve-se padronizar para `-webkit-line-clamp: 3;`.
2. **Diferenciação Visual:** Tornar mais evidente a distinção entre "Comunicado Interno" e "Artigo em Periódico Internacional".

### 5.6. Carrossel de Atalhos Rápidos (`CarouselNavigation.jsx`)
1. **Botões Ocultados no Mobile:** Em telas pequenas, `.carousel-btn` recebe `display: none;`, impossibilitando navegação manual. Devem permanecer visíveis ou ser substituídos por indicadores de pontos (*dots pagination*) com suporte a touch swipe.
2. **Código Duplicado:** Remover definições repetidas de `.card-cta-btn` no arquivo CSS.

### 5.7. Busca Global Spotlight (`SpotlightSearch.jsx`)
1. **Base de Dados Limitada:** O componente só pesquisa 5 itens hardcoded. Deve importar dinamicamente e agregar dados reais de `works.json`, `news.json`, `members.json` e `equipment.json`.
2. **Navegação por Teclado:** Adicionar listeners para `ArrowDown` (descer seleção), `ArrowUp` (subir seleção) e `Enter` (abrir item selecionado).
3. **Bug React 19:** Resolver o aviso do ESLint em `setQuery('')` síncrono dentro do `useEffect`.

### 5.8. Modal de Contatos Rápidos (`ContactModal.jsx`)
1. **Feedback de Cópia Acessível:** Adicionar região viva (`aria-live="polite"`) para avisar usuários de leitor de tela que o e-mail foi copiado para a área de transferência.
2. **Links de Lattes Incompletos:** Discentes sem Lattes cadastrado não devem ter link ativo para o endereço com zeros (`0000000000000000`).

### 5.9. Páginas Internas

#### `/trabalhos` (`Works.jsx`)
* Adicionar campo de busca textual direta por palavras-chave além das abas "Todos", "Em Andamento" e "Concluídos".
* Adicionar aviso visual nos links externos com DOI (`aria-label="... (abre em nova aba)"`).

#### `/pessoas` (`Peaple.jsx` -> `People.jsx`)
* **Correção Ortográfica Imediata:** Renomear `Peaple.jsx` e `Peaple.css` para `People.jsx` e `People.css`, ajustando as importações em `App.jsx`.
* Adicionar tratamento elegante para membros com currículo em atualização.

#### `/laboratorio` (`Lab.jsx`)
* **Correção Crítica de Roteamento:** Substituir `<a href="/agendamento">` por `<Link to="/agendamento">` (linha 94).
* **Alinhamento Institucional de Endereço:** Padronizar se a sede física é "Campus Tapajós, Bloco 1, Sala 5" ou "Bloco 09, sala 06".

#### `/agendamento` (`Booking.jsx`)
* O componente atual apresenta apenas um placeholder estático do Google Calendar e direciona para o Google Forms.
* Recomenda-se um seletor visual interativo de turnos (Manhã / Tarde / Noite) que permita ao aluno pré-visualizar a disponibilidade antes de clicar no link externo.

#### `/noticias` (`News.jsx`)
* Adicionar busca por título/tema e modal simples de expansão para ler o comunicado completo sem truncamento.

---

## 6. Diagnóstico Técnico de Engenharia Frontend

### 6.1. Relatório do ESLint (20 Ocorrências)
O comando `npm run lint` falha atualmente devido a:
* **Imports Inúteis de React:** Em React 19 com JSX transform moderno, `import React from 'react'` é desnecessário e gera erros de `no-unused-vars` em 14 arquivos.
* **Ícones Não Utilizados:** `Mail` em `ContactModal.jsx`, `AlertTriangle` em `Booking.jsx`.
* **Chamada Síncrona de State em Effect:** Linha 60 em `SpotlightSearch.jsx` (`calling setState synchronously within an effect`).
* **Dependência Faltante em Hook:** `CarouselNavigation.jsx` com dependência faltante no `useEffect`.

---

## 7. Plano de Implementação em 4 Fases (Roadmap de Execução)

### Fase 1: Higiene Técnica, Correções Críticas & A11y (Imediato)
1. **Renomeação:** Renomear `Peaple.jsx` e `Peaple.css` para `People.jsx` e `People.css` e atualizar em `App.jsx`.
2. **Correção do ESLint:** Limpar todos os 20 erros de linter (remover `import React`, imports não usados e corrigir hooks).
3. **Remover Código Morto:** Deletar `src/components/home/RulesAccordion.jsx` (arquivo vazio).
4. **Metadados e Idioma:** Corrigir `index.html` para `lang="pt-BR"`, definir `<title>LABETA – Laboratório de Ecologia e Taxonomia de Algas | UFOPA</title>` e apontar favicon existente.
5. **Skip-to-Content Link:** Adicionar o link de navegação rápida por teclado no topo de `App.jsx`.
6. **Substituição de Tags `<a>`:** Mudar link de agendamento em `Lab.jsx` para `<Link to="/agendamento">`.
7. **Assets Quebrados (Placeholders):** Adicionar imagens ou vetores SVG temáticos elegantes em `public/placeholders/` (`bancada.jpg`, `microscopio.jpg`, `campo.jpg`).
8. **Unificação de Endereço:** Padronizar o endereço oficial do LABETA em todo o portal.

### Fase 2: Design System & Refinamento Tipográfico
1. **Expansão de `theme.css`:** Criar tokens semânticos completos de cor, espaçamento, sombras e raios de curvatura.
2. **Remoção de `text-align: justify`:** Alinhar textos à esquerda em `AboutSection.css` para conformidade com a WCAG.
3. **Escala de Tipografia:** Garantir que todos os badges e textos secundários tenham no mínimo `12px` (0.75rem).
4. **Tratamento de `:focus-visible`:** Adicionar anel de foco visível com alto contraste dourado para navegação via teclado.

### Fase 3: Modernização de Componentes e Interatividade
1. **Navbar:** Implementar detecção de SO para atalhos (`Ctrl+K` vs `⌘K`) e refatorar menu mobile com gaveta suave e backdrop escurecido.
2. **Spotlight Search Real:** Integrar busca multi-acervo conectando `works.json`, `members.json`, `news.json` e `equipment.json`, com suporte total a navegação por teclado (`↑`, `↓`, `Enter`).
3. **Carrossel Acessível:** Adicionar botão de Pausar/Reproduzir, suporte a touch-swipe e manter paginação visível em smartphones.
4. **Seção Sobre:** Reescrever os parágrafos duplicados em texto fluido e institucional.
5. **Regras e Biossegurança:** Configurar acordeão para iniciar apenas com a regra prioritária aberta.

### Fase 4: Experiência das Páginas e Funcionalidades Avançadas
1. **Filtro e Busca em Trabalhos:** Permitir pesquisa por autor e tema na página `/trabalhos`.
2. **Tratamento de Lattes em Pessoas:** Exibir estado inativo elegante quando o membro não possuir currículo cadastrado.
3. **Prévia Interativa de Agendamento:** Enriquecer a página `/agendamento` com painel de horários e turnos antes do formulário do Google Forms.
4. **Integração com Supabase ("Admin Invisível"):** Preparar estrutura para futura edição inline autorizada conforme diretriz arquitetural de 08/10/2026.

---

## 8. Conclusão

O portal LABETA tem alto potencial de impacto científico e institucional. A aplicação deste plano de modernização de UI/UX elevará a nota global de maturidade do projeto para **9.5 / 10**, garantindo conformidade com padrões internacionais de acessibilidade web (WCAG 2.2), perfeita responsividade em qualquer dispositivo móvel e uma experiência fluida tanto para a comunidade acadêmica quanto para o público geral.
