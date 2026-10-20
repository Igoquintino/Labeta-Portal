# Plano Diretor de Implementação: Modo Claro (Light Mode) – "Amazônia Diurna"
## Portal Web LABETA – Laboratório de Ecologia e Taxonomia de Algas (UFOPA)

> **Para agentes de execução e desenvolvedores:** SUB-SKILL OBRIGATÓRIA: Use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa. As etapas utilizam a sintaxe de checkbox (`- [ ]`) para acompanhamento.

**Goal:** Implementar o Modo Claro (*Light Mode / "Amazônia Diurna"*) no Portal LABETA com alternância dinâmica, persistência local, respeito às preferências do sistema operacional (`prefers-color-scheme`), contraste estrito WCAG 2.2 AAA/AA e fidelidade biológica à identidade ficológica da UFOPA.

**Architecture:** Extensão da arquitetura de Design Tokens de 3 camadas em `src/styles/theme.css` via seletor `[data-theme='light']`, gerenciada por um `ThemeContext` reativo em React 19, alimentando um componente acessível `ThemeToggle` posicionado na `Navbar` e preservando integridade nos modais e páginas internas.

**Tech Stack:** React 19, Vite 8, Lucide React (`Sun`, `Moon`), CSS Custom Properties (Tokens Semânticos), Vitest + React Testing Library.

**Spec:** [`labeta-portal/Rel_Audi_Plan/PLANEJAMENTO_MODERNIZACAO_DESIGN_ARQUITETURA_2026-10-20.md`](file:///home/igoquintino/Documentos/Desenvolvimento_Projetos/Front_Labeta/labeta-portal/Rel_Audi_Plan/PLANEJAMENTO_MODERNIZACAO_DESIGN_ARQUITETURA_2026-10-20.md) e [`labeta-portal/Rel_Audi_Plan/AUDITORIA_UI_UX_LABETA.md`](file:///home/igoquintino/Documentos/Desenvolvimento_Projetos/Front_Labeta/labeta-portal/Rel_Audi_Plan/AUDITORIA_UI_UX_LABETA.md).

---

## 1. Justificativa de UX e Fundamentação Conceitual

### 1.1. O Desafio Atual
O portal consolidou uma identidade noturna marcante (**"Dark / Amazônia Noturna"**), baseada em Grafite Amazônico (`#0C120F`) e Verde Clorofila (`#4EA86E`). Contudo, conforme apontado na Auditoria de UI/UX:
1. **Ergonomia e Conforto Visual:** A leitura prolongada de artigos científicos, teses e descrições taxonômicas sob luz diurna ou em ambientes iluminados em modo escuro causa fadiga visual e reflexos excessivos em telas de notebooks e smartphones.
2. **Heurística de Nielsen #7 (Flexibilidade e Eficiência de Uso):** O sistema deve acomodar diferentes perfis de usuários e contextos de iluminação, permitindo a livre escolha do tema.
3. **Acessibilidade WCAG 2.2:** Usuários com astigmatismo ou fotofobia moderada têm desempenho de leitura comprovadamente superior em interfaces com polaridade positiva (texto escuro sobre fundo claro).

### 1.2. O Conceito "Amazônia Diurna / Águas Claras"
A versão clara não deve ser um "branco hospitalar" desprovido de alma. Utilizando a base de inteligência da skill `ui-ux-pro-max` (categorias *Nature Distilled*, *Academic Publishing* e *Organic Biophilic*), o Modo Claro adota:
* **Fundo / Canvas:** Alabastro Fluvial (`#F8FAF8`) e Areia Aluvial Clara (`#F0EDE4`), evocando as praias de areia branca do Rio Tapajós no verão amazônico.
* **Superfícies de Cards:** Branco Neve Puro (`#FFFFFF`) com bordas suaves em tom de folhas secas (`#DDE5E0`) e sombras difusas suaves.
* **Texto Principal:** Grafite Amazônico Profundo (`#0D1712`), oferecendo nitidez tipográfica com contraste $> 15:1$ (nível AAA).
* **Texto Secundário:** Verde Ardósia (`#43574C`), atingindo contraste $> 5.8:1$ (nível AA).
* **Dourado Adaptativo:** O dourado noturno (`#D6C28F`) é substituído no modo claro por **Ouro Velho / Âmbar Fluvial (`#9E6700`)**, garantindo conformidade de contraste de pelo menos $4.5:1$ sobre fundos claros.
* **Verde Institucional UFOPA:** Mantido estritamente em `#165B33`.

---

## 2. Matriz Comparativa de Tokens (Dark vs. Light)

A arquitetura de tokens de 3 camadas no `src/styles/theme.css` permite que 100% dos componentes adaptem seu visual sem necessidade de duplicar regras de CSS, operando unicamente na **Camada 2 (Tokens Semânticos)**:

| Token Semântico | Modo Escuro (Default / `:root`) | Modo Claro (`[data-theme='light']`) | Função & Papel no Design System | Contraste Light |
| :--- | :--- | :--- | :--- | :---: |
| `--bg-canvas` | `#0C120F` (Grafite Noturno) | `#F8FAF8` (Alabastro Tapajós) | Plano de fundo principal do `body` e layout | N/A |
| `--bg-surface` | `#14241B` (Superfície Noturna) | `#FFFFFF` (Branco Neve) | Superfície padrão de cards e seções | N/A |
| `--bg-surface-elevated` | `#1B3125` (Superfície Elevada) | `#EFF4F0` (Verde Névoa Suave) | Headers, inputs, dropdowns e hovers | N/A |
| `--bg-navbar` | `rgba(12, 18, 15, 0.94)` | `rgba(248, 250, 248, 0.94)` | Barra de navegação fixa com efeito blur | N/A |
| `--bg-backdrop` | `rgba(12, 18, 15, 0.85)` | `rgba(13, 23, 18, 0.45)` | Cortina de fundo para modais e gavetas | N/A |
| `--text-primary` / `--text-main` | `#F4F7F4` (Alabastro Claro) | `#0D1712` (Grafite Profundo) | Títulos, rótulos e corpo de texto principal | **15.4:1 (AAA)** |
| `--text-secondary` / `--text-muted` | `#A0B0A4` (Verde Muted) | `#43574C` (Verde Ardósia) | Subtítulos, metadados, datas e descrições | **5.8:1 (AA)** |
| `--color-gold` / `--accent-gold` | `#D6C28F` (Dourado Claro) | `#9E6700` (Ouro Velho / Âmbar) | Destaques nobres, bordas ativas e badges | **4.9:1 (AA)** |
| `--color-brand` | `#165B33` (Verde UFOPA) | `#165B33` (Verde UFOPA) | Identidade institucional primária | **6.4:1 (AA)** |
| `--color-accent` | `#4EA86E` (Verde Clorofila) | `#1B7340` (Verde Clorofila Intenso) | Ícones interativos, hover e tags de sucesso | **4.8:1 (AA)** |
| `--border-subtle` | `rgba(214, 194, 143, 0.15)` | `rgba(22, 91, 51, 0.12)` | Divisores sutis de listas e cartões | N/A |
| `--border-medium` | `rgba(214, 194, 143, 0.35)` | `rgba(22, 91, 51, 0.24)` | Contornos de formulários e caixas de busca | N/A |
| `--border-gold` | `rgba(214, 194, 143, 0.45)` | `rgba(158, 103, 0, 0.40)` | Borda de destaque de cards e modais | N/A |
| `--shadow-card` | `0 4px 20px rgba(0, 0, 0, 0.25)` | `0 4px 20px rgba(16, 36, 24, 0.07)` | Elevação discreta em superfícies brancas | N/A |
| `--shadow-elevated` | `0 8px 32px rgba(0, 0, 0, 0.35)` | `0 8px 30px rgba(16, 36, 24, 0.12)` | Elevação de dropdowns e cards em foco | N/A |
| `--shadow-modal` | `0 16px 48px rgba(0, 0, 0, 0.60)` | `0 16px 48px rgba(16, 36, 24, 0.20)` | Profundidade tridimensional de diálogos | N/A |

---

## 3. Global Constraints & Requisitos de Engenharia

1. **Piso Mínimo de Acessibilidade:** Fontes mantêm floor de `0.75rem` (`12px`) via `--font-xs`.
2. **Contraste Mínimo WCAG 2.2:** Todo texto principal em Modo Claro deve ter contraste $\ge 7:1$ (AAA); textos secundários $\ge 4.5:1$ (AA).
3. **Persistência Sem FOUC (*Flash of Unstyled Content*):** O tema ativo deve ser lido do `localStorage` (`labeta-theme`) antes da renderização do React, aplicando a classe ou atributo no `<html>` para evitar piscadas visuais ao recarregar.
4. **Respeito ao Sistema Operacional:** Caso o usuário não tenha preferência explícita salva no navegador, o sistema deve respeitar `@media (prefers-color-scheme: light/dark)` e reagir em tempo real a mudanças no SO.
5. **Zero Breaking Changes:** A paleta dark permanece intacta como valor padrão se nenhum tema estiver definido.

---

## 4. Review Focus (Casos de Borda e Modos de Falha)

1. **Transição de Dourado no Modo Claro:** O dourado original (`#D6C28F`) sobre fundo branco tem contraste irrisório de $1.6:1$. O sistema deve forçar o token `--color-gold` para `#9E6700` no modo claro, garantindo $> 4.5:1$.
2. **Imagens Vetoriais e Mosaico Hero:** Imagens SVG como os placeholders de bancada e microscópio devem ser legíveis em ambos os modos ou receber tratamentos de moldura/card que preservem contraste.
3. **Backdrops de Modais:** Modais em modo claro não devem escurecer excessivamente a tela a ponto de parecer um erro visual nem ser tão claros que percam a contenção focal; o backdrop de `rgba(13, 23, 18, 0.45)` com `backdrop-filter: blur(6px)` resolve o equilíbrio.
4. **Inputs de Formulário no AdminModal e News:** Inputs de texto devem alternar fundo para `#FFFFFF` ou `#EFF4F0` com texto `#0D1712`, evitando o bug clássico de texto branco sobre fundo branco.
5. **Meta Tag Theme-Color:** Ao alternar para o Modo Claro, a meta tag `<meta name="theme-color" content="#F8FAF8">` no `<head>` deve ser sincronizada para colorir a barra de navegação dos smartphones (Safari iOS e Chrome Android).

---

## 5. Estrutura de Arquivos

```
labeta-portal/
├── src/
│   ├── context/
│   │   ├── ThemeContext.jsx        <-- Provedor de contexto global de tema
│   │   └── useTheme.js             <-- Hook customizado para consumir e alternar o tema
│   ├── components/
│   │   └── common/
│   │       ├── ThemeToggle.jsx     <-- Botão interativo de alternância (Sol / Lua)
│   │       └── ThemeToggle.css     <-- Estilos, animação de rotação e acessibilidade do toggle
│   ├── styles/
│   │   └── theme.css               <-- Expansão com a camada [data-theme='light']
│   └── components/
│       └── common/
│           ├── Navbar.jsx          <-- Inserção do ThemeToggle no Desktop e Mobile
│           └── Navbar.css
test/
├── theme-context.test.jsx          <-- Testes de persistência, alternância e matchMedia
└── theme-tokens-light.test.js      <-- Teste automatizado de contraste e presença dos tokens light
```

---

## 6. Roteiro Detalhado de Implementação (Tarefas 1 a 6)

### Tarefa 1: Definição dos Tokens de Modo Claro no `theme.css` e Testes Automatizados
**Arquivos:**
- Modificar: `src/styles/theme.css`
- Criar: `test/theme-tokens-light.test.js`

- [ ] **Passo 1.1:** Escrever teste que falha em `test/theme-tokens-light.test.js` verificando que as regras para `[data-theme='light']` existem em `theme.css` e sobrescrevem `--bg-canvas`, `--bg-surface`, `--text-primary`, `--color-gold`, etc.
- [ ] **Passo 1.2:** Executar o teste e confirmar falha controlada.
- [ ] **Passo 1.3:** Adicionar a seção `[data-theme='light']` em `src/styles/theme.css` contendo os tokens semânticos diurnos com contraste testado.
- [ ] **Passo 1.4:** Reexecutar o teste e garantir sinal verde.
- [ ] **Passo 1.5:** Realizar commit: `feat(tokens): add light mode semantic tokens for Amazonia Diurna theme`.

---

### Tarefa 2: `ThemeContext` e Hook `useTheme` com Suporte a `localStorage` e SO
**Arquivos:**
- Criar: `src/context/ThemeContext.jsx`
- Criar: `src/context/useTheme.js`
- Modificar: `src/main.jsx` (envolver `<App />` com `<ThemeProvider>`)
- Criar: `test/theme-context.test.jsx`

- [ ] **Passo 2.1:** Escrever teste unitário em `test/theme-context.test.jsx` validando:
  - Inicialização padrão com `'dark'`.
  - Leitura de chave existente no `localStorage`.
  - Respeito a `window.matchMedia('(prefers-color-scheme: light)')`.
  - Alternância de tema via `toggleTheme()` e aplicação de `data-theme` no `document.documentElement`.
- [ ] **Passo 2.2:** Executar teste e confirmar falha.
- [ ] **Passo 2.3:** Implementar `src/context/ThemeContext.jsx` com lógica resiliente de SSR/jsdom e sincronização da `<meta name="theme-color">`.
- [ ] **Passo 2.4:** Implementar `src/context/useTheme.js` com tratamento de erro fora do provedor.
- [ ] **Passo 2.5:** Envolver a árvore de componentes em `src/main.jsx` com `<ThemeProvider>`.
- [ ] **Passo 2.6:** Executar os testes e confirmar aprovação.
- [ ] **Passo 2.7:** Realizar commit: `feat(theme): implement ThemeContext, useTheme hook and system preference listeners`.

---

### Tarefa 3: Componente `ThemeToggle` Acessível com Ícones Animados
**Arquivos:**
- Criar: `src/components/common/ThemeToggle.jsx`
- Criar: `src/components/common/ThemeToggle.css`
- Modificar: `src/components/common/Navbar.jsx`
- Modificar: `src/components/common/Navbar.css`
- Criar: `test/theme-toggle.test.jsx`

- [ ] **Passo 3.1:** Escrever teste para `ThemeToggle.jsx` verificando renderização de ícone `Sun` no modo dark e `Moon` no modo light, com rótulos `aria-label` claros e disparo de `toggleTheme`.
- [ ] **Passo 3.2:** Implementar `ThemeToggle.jsx` com ícones da `lucide-react`, transição suave de rotação e foco acessível com `:focus-visible`.
- [ ] **Passo 3.3:** Integrar `ThemeToggle` no cabeçalho `Navbar.jsx` (ao lado de Busca e Contato) e dentro da gaveta mobile.
- [ ] **Passo 3.4:** Validar responsividade e cliques em tela ampla e mobile.
- [ ] **Passo 3.5:** Realizar commit: `feat(ui): add accessible ThemeToggle button to Navbar and mobile drawer`.

---

### Tarefa 4: Refinamento de Modais Globais e Elementos Flutuantes
**Arquivos:**
- Modificar: `src/components/common/Navbar.css`
- Modificar: `src/components/common/Footer.css`
- Modificar: `src/components/modals/SpotlightSearch.css`
- Modificar: `src/components/modals/ContactModal.css`
- Modificar: `src/components/admin/AdminModal.css`
- Modificar: `src/components/admin/FloatingAdminBar.css`

- [ ] **Passo 4.1:** Substituir fundos hardcoded `rgba(12, 18, 15, ...)` restantes por tokens semânticos de backdrop e navbar.
- [ ] **Passo 4.2:** Ajustar o `SpotlightSearch` para que a caixa de diálogo fique nítida em modo claro, com destaque nos termos buscados e teclas de atalho (`KBD`).
- [ ] **Passo 4.3:** Ajustar o `ContactModal` para que a lista de membros e botões de cópia de e-mail mantenham legibilidade excelente.
- [ ] **Passo 4.4:** Ajustar o `AdminModal` e formulários para exibir caixas de entrada claras com borda de foco verde institucional.
- [ ] **Passo 4.5:** Testar navegação por teclado e focus trap em ambos os modos.
- [ ] **Passo 4.6:** Realizar commit: `refactor(modals): adapt Spotlight, Contact and Admin modals for dual theme support`.

---

### Tarefa 5: Homologação e Ajuste Fino das Telas Internas
**Arquivos:**
- Modificar: `src/components/home/HeroMosaic.css`
- Modificar: `src/components/home/CarouselNavigation.css`
- Modificar: `src/pages/Works.css`
- Modificar: `src/pages/People.css`
- Modificar: `src/pages/News.css`
- Modificar: `src/pages/Lab.css`
- Modificar: `src/pages/Booking.css`

- [ ] **Passo 5.1:** Validar contraste em cards científicos da página `/trabalhos` (badges de status e links DOI).
- [ ] **Passo 5.2:** Validar cards de pesquisadores na página `/pessoas` (chips de categoria e linhas de pesquisa).
- [ ] **Passo 5.3:** Validar radar ficológico e avisos na página `/noticias`.
- [ ] **Passo 5.4:** Validar catálogo de equipamentos e calendário de agendamento na página `/agendamento`.
- [ ] **Passo 5.5:** Validar trilha metodológica e espaços físicos em `/laboratorio`.
- [ ] **Passo 5.6:** Realizar commit: `feat(pages): fine-tune internal pages and component cards for Light Mode contrast`.

---

### Tarefa 6: Auditoria Final WCAG 2.2, Regressão de Testes e Build de Produção
**Arquivos:**
- Modificar: `index.html` (inserir script anti-FOUC leve de 5 linhas no `<head>`)
- Executar: Suíte completa de testes (`npm test`)
- Executar: Linting global (`npm run lint`)
- Executar: Build de produção (`npm run build`)

- [ ] **Passo 6.1:** Inserir script inline minificado no `<head>` do `index.html` para ler `localStorage.getItem('labeta-theme')` antes da renderização do DOM.
- [ ] **Passo 6.2:** Executar todos os testes automatizados (todas as 15+ suites devem passar com 100% de sucesso).
- [ ] **Passo 6.3:** Executar `npm run lint` e certificar zero avisos e zero erros.
- [ ] **Passo 6.4:** Executar `npm run build` e confirmar compilação limpa sem aumento expressivo de bundle.
- [ ] **Passo 6.5:** Realizar commit final: `feat(theme): complete light mode implementation, a11y compliance and anti-fouc script`.

---

## 7. Critérios de Homologação e Conclusão

1. **Alternância Instantânea:** Clicar no botão de alternância alterna imediatamente entre Modo Escuro e Modo Claro sem recarregar a página e sem quebras visuais.
2. **Persistência Confiável:** Ao recarregar ou navegar entre páginas, o tema escolhido é mantido.
3. **Piso de Acessibilidade:** Em nenhum modo ou resolução haverá fontes menores que 12px (`0.75rem`).
4. **Contraste 100% Aprovado:** Todos os textos principais cumprem WCAG AAA ($\ge 7:1$) e textos secundários cumprem WCAG AA ($\ge 4.5:1$).
5. **Autonomia:** O sistema funciona perfeitamente offline ou com falha de rede via fallback local.
