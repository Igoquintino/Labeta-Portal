# Modernização de UI/UX, Acessibilidade Digital (WCAG 2.2) e Experiência do Gestor (Portal LABETA) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar a maturidade de UI/UX do Portal LABETA para nota 9.5/10, integrando acessibilidade completa WCAG 2.2 AA, eliminando fricções de usabilidade (justificação de texto, links quebrados e quebras mobile) e transformando a arquitetura "Admin Invisível" em uma experiência ergonômica com modais contextuais in-place e notificações toast.

**Architecture:** Abordagem Frontend-First com Design System em 3 camadas de variáveis CSS (`theme.css`), estilização consistente com o conceito Dark/Amazônia Noturna, focus-visible com alto contraste dourado, controle de navegação acessível por teclado, componentes modais reutilizáveis com armadilha de foco e sistema de toast não-bloqueante para feedback de ações administrativas.

**Tech Stack:** React 19, Vite 8, React Router Dom 7, CSS Moderno nativo escopado, `lucide-react`.

**Spec:**
- `labeta-portal/AUDITORIA_UI_UX_LABETA.md`
- `labeta-portal/src/DOCUMENTO_REQUISITOS_LABETA.md`
- `labeta-portal/src/RELATORIO_CUMULATIVO_LABETA.md`
- `labeta-portal/src/Relatório de Implementação Funcional: Arquitetura "Admin Invisível.md`

---

## Global Constraints

- **Preservação Visual:** A paleta oficial Dark / Amazônia Noturna (`#0C120F`, `#14241B`, `#165B33`, `#D6C28F`, `#4EA86E`) e o slogan "Algas da Amazônia" devem ser preservados rigorosamente.
- **Zero Alerts Nativos:** Fica terminantemente proibido o uso de `window.alert()`, `window.confirm()` ou `window.prompt()`; todas as confirmações e avisos devem ser modais ou toasts customizados.
- **Conformidade WCAG 2.2 AA:** Skip link funcional, contraste mínimo de 4.5:1 para texto padrão e 3:1 para acentos/ícones, foco visível (`:focus-visible`), e proibição de `text-align: justify`.
- **Integridade SPA:** Nenhuma navegação interna pode recarregar a página (`<Link>` / `useNavigate` obrigatórios).
- **Invisibilidade Administrativa:** A interface pública do visitante deve permanecer 100% limpa, sem expor botões de login na Navbar ou rodapé.

---

## Review Focus

1. **Acessibilidade de Navegação por Teclado:** O usuário deve conseguir navegar por todo o portal apenas com a tecla `Tab`, visualizar com clareza o foco (anel dourado de 2px), acessar o skip-link no início e fechar qualquer modal aberto com a tecla `Esc`.
2. **Responsividade em Dispositivos Estreitos (360px - 480px):** Em telas mobile compactas, o iframe de agendamento, o mosaico do hero e os cards de equipamentos devem se ajustar fluidamente sem gerar barra de rolagem horizontal no body.
3. **Ergonomia do Acesso Administrativo via Spotlight:** Digitar `:admin` ou `admin` no campo do Spotlight Search (`Ctrl+K`) deve revelar discretamente o atalho protegido para o painel de acesso administrativo sem expor links na navegação convencional.
4. **Leitura Imersiva de Notícias sem Truncamento:** Ao clicar em um comunicado operacional longo na página de notícias, o usuário deve ter a opção de ler o texto completo em um modal de leitura fluida, eliminando a frustração do truncamento textual (`-webkit-line-clamp`).
5. **Feedback Não-Invasivo ao Administrador:** Qualquer ação de salvar, editar ou remover registros deve emitir um feedback visual agradável via Toast temporizado (4 segundos) com animação suave e opção de fechamento manual.

---

## Matriz de Modernização UI/UX

| Área / Componente | Situação Atual | Oportunidade da Melhor Opção UI/UX | Impacto no Usuário |
| :--- | :--- | :--- | :---: |
| **Acessibilidade Global** | Sem skip-link; `text-align: justify` em parágrafos; sem anel de foco visível padronizado. | Skip-to-content invisível até focar; alinhamento à esquerda com `max-width: 65ch`; `:focus-visible` com anel dourado `#D6C28F`. | **Alto (WCAG 2.2 AA)** |
| **Navegação & Spotlight** | Spotlight tem apenas busca de itens públicos; atalho `Ctrl+K` não oferece transição para gestão. | Integração do comando `:admin` no Spotlight para entrada discreta de gestores autorizados. | **Alto (Ergonomia)** |
| **Agendamento (`/agendamento`)** | Iframe com largura fixa de 554px e e-mail pessoal exposto; sem guia de turnos. | Container de iframe com `aspect-ratio` responsivo; guia visual de turnos (Manhã/Tarde/Noite) antes do Google Forms. | **Alto (Mobile & Clareza)** |
| **Notícias (`/noticias`)** | Textos longos truncados sem possibilidade de expansão; sem busca textual na página. | Campo de busca rápida no topo e modal imersivo de leitura integral com tipografia editorial. | **Médio (Engajamento)** |
| **Trabalhos (`/trabalhos`)** | Links DOI sem aviso de que abrem em nova aba; ausência de filtros rápidos por ano. | Badges de ano e tags com `aria-label="... (abre em nova aba)"` + ícone discreto `ExternalLink`. | **Médio (Acessibilidade)** |
| **Pessoas (`/pessoas`)** | Discentes com Lattes `0000000000000000` levam a erro 404 do CNPq. | Badge desabilitado com visual neutro "Currículo em atualização", idêntico ao `ContactModal`. | **Médio (Prevenção de Erros)** |
| **Admin Invisível (Gestão)** | Botões nos cards disparam `alert()`; toolbar empurra o cabeçalho das páginas públicas. | Barra flutuante discreta no rodapé (Floating Pill) + Modais in-place com validação e Toasts. | **Crítico (Usabilidade)** |

---

## Tarefas de Implementação

### Task 1: Design Tokens, Skip-Link e Refinamento de Tipografia e Foco

**Files:**
- Modify: `labeta-portal/src/styles/theme.css`
- Modify: `labeta-portal/src/App.jsx`
- Modify: `labeta-portal/src/components/home/AboutSection.css`

**Interfaces:**
- Consumes: Variáveis primitivas
- Produces: Tokens semânticos em 3 camadas, classe `.skip-to-content`, regra global `:focus-visible`.

- [ ] **Step 1: Expandir `theme.css` com tokens semânticos e foco de alto contraste**
Adicionar tokens:
```css
:root {
  --focus-ring: 0 0 0 2px var(--color-gold), 0 0 0 4px rgba(22, 91, 51, 0.4);
  --color-danger: #E07A5F;
  --color-danger-bg: rgba(224, 122, 95, 0.15);
  --color-success: #4EA86E;
  --color-success-bg: rgba(78, 168, 110, 0.15);
}

:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

- [ ] **Step 2: Adicionar Skip-Link no topo de `src/App.jsx`**
```jsx
<a href="#main-content" className="skip-to-content">
  Pular para o conteúdo principal
</a>
```
Com estilo CSS em `index.css`:
```css
.skip-to-content {
  position: absolute;
  top: -100px;
  left: 1rem;
  background-color: var(--color-gold);
  color: var(--bg-primary);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  z-index: 9999;
  transition: top 0.2s ease;
}
.skip-to-content:focus {
  top: 1rem;
}
```

- [ ] **Step 3: Corrigir justificação de texto em `AboutSection.css`**
Substituir `text-align: justify; text-justify: inter-word;` por:
```css
.about-text {
  text-align: left;
  line-height: 1.8;
  max-width: 65ch;
  margin: 0 auto;
}
```

- [ ] **Step 4: Executar validação de linter**
Run: `cd labeta-portal && npm run lint`
Expected: 0 erros.

---

### Task 2: Refinamento de Navegação e Atalho Administrativo Secreto no Spotlight

**Files:**
- Modify: `labeta-portal/src/components/modals/SpotlightSearch.jsx`
- Modify: `labeta-portal/src/components/modals/SpotlightSearch.css`

**Interfaces:**
- Consumes: `query`, `searchableBase`
- Produces: Item de busca secreto para `/admin` ao digitar `:admin` ou `admin`.

- [ ] **Step 1: Injetar gatilho administrativo discreto na busca**
Em `SpotlightSearch.jsx`, quando `query.toLowerCase().trim() === ':admin'` ou `admin`:
```javascript
if (normalizedQuery === ':admin' || normalizedQuery === 'admin') {
  list.unshift({
    id: 'admin-entry',
    category: 'Gestão',
    title: 'Painel Administrativo do LABETA',
    subtitle: 'Acesso restrito para coordenação e equipe autorizada',
    link: '/admin',
    isSecret: true
  });
}
```

- [ ] **Step 2: Estilizar badge de gestão no modal**
Criar estilo dourado sutil para a categoria `Gestão` no CSS do Spotlight.

- [ ] **Step 3: Testar navegação por teclado**
Abrir Spotlight com `Ctrl+K`, digitar `:admin`, navegar com `Enter` e confirmar redirecionamento para `/admin`.

---

### Task 3: Painel Ergonômico de Agendamento e Iframe Fluido (`Booking.jsx`)

**Files:**
- Modify: `labeta-portal/src/pages/Booking.jsx`
- Modify: `labeta-portal/src/pages/Booking.css`

**Interfaces:**
- Consumes: `equipmentData`, `useAuth`
- Produces: Container fluido com `min-height: 480px` e bloco informativo de turnos de bancada.

- [ ] **Step 1: Criar componente de cartões de turnos operacionais**
Inserir antes do formulário externo um seletor visual informativo dos turnos do laboratório:
- **Manhã (08:00 - 12:00):** Triagem e preparação de amostras ficológicas.
- **Tarde (14:00 - 18:00):** Microscopia óptica de alta resolução e contagem celular.
- **Noite (18:00 - 21:00):** Restrito a pós-graduandos e processos de longa duração.

- [ ] **Step 2: Tornar o iframe 100% responsivo no CSS**
Remover atributos fixos de largura e implementar container CSS com proporção adequada e scroll interno controlado:
```css
.calendar-embed-container {
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.calendar-iframe {
  width: 100%;
  height: 480px;
  border: none;
}
@media (max-width: 600px) {
  .calendar-iframe {
    height: 380px;
  }
}
```

- [ ] **Step 3: Testar responsividade em viewport móvel**
Validar renderização em 375px e 768px sem quebra horizontal.

---

### Task 4: Experiência das Notícias & Trabalhos (Leitura Integral e Avisos A11y)

**Files:**
- Modify: `labeta-portal/src/pages/News.jsx`
- Modify: `labeta-portal/src/pages/News.css`
- Modify: `labeta-portal/src/pages/Works.jsx`

**Interfaces:**
- Consumes: `newsData`, `worksData`
- Produces: Modal de leitura de comunicados completos e links DOI acessíveis com `aria-label`.

- [ ] **Step 1: Implementar campo de busca rápida em `News.jsx`**
Permitir filtragem por título, data ou palavras-chave diretamente no topo da listagem de comunicados e artigos do radar científico.

- [ ] **Step 2: Criar modal de leitura integral do comunicado**
Ao clicar no card de comunicado, abrir modal imersivo com o texto completo, data de emissão, assinatura institucional e botão de fechamento acessível.

- [ ] **Step 3: Adicionar avisos de abertura em nova aba em `Works.jsx`**
Em todos os links externos com DOI:
```jsx
<a 
  href={work.link} 
  target="_blank" 
  rel="noopener noreferrer"
  className="work-external-link"
  aria-label={`Acessar publicação: ${work.title} (abre em nova aba)`}
>
  <span>Ver Artigo</span>
  <ExternalLink size={13} aria-hidden="true" />
</a>
```

- [ ] **Step 4: Executar linter e build**
Run: `cd labeta-portal && npm run lint && npm run build`
Expected: 0 erros.

---

### Task 5: Experiência de Gestão Admin Invisível (Floating Management Bar & Toast System)

**Files:**
- Create: `labeta-portal/src/components/common/ToastNotification.jsx`
- Create: `labeta-portal/src/components/common/ToastNotification.css`
- Create: `labeta-portal/src/components/admin/FloatingAdminBar.jsx`
- Create: `labeta-portal/src/components/admin/FloatingAdminBar.css`
- Modify: `labeta-portal/src/App.jsx`
- Modify: `labeta-portal/src/pages/AdminLogin.jsx`

**Interfaces:**
- Consumes: `isAdmin`, `user`, `signOut`
- Produces: Toast global acionável por eventos (`showToast(msg, type)`) e barra flutuante discreta no canto da tela quando autenticado.

- [ ] **Step 1: Criar componente `ToastNotification.jsx`**
Com suporte a tipos `success`, `error`, `info`, fechamento automático após 4 segundos e acessibilidade com `role="status"` e `aria-live="polite"`.

- [ ] **Step 2: Criar `FloatingAdminBar.jsx`**
Quando `isAdmin === true`, exibir pill flutuante no canto inferior direito da tela:
- Indicador luminoso verde ("Modo Gestor Ativo").
- E-mail resumido do usuário logado.
- Botão discreto de logout com confirmação.
- Não empurra o layout do portal nem desfigura a visualização pública.

- [ ] **Step 3: Modernizar `AdminLogin.jsx` com CSS modular**
Substituir os estilos inline por `AdminLogin.css`, com campos de alto contraste, foco acessível e feedback visual coeso.

- [ ] **Step 4: Validar build e integridade de todos os componentes**
Run: `cd labeta-portal && npm run lint && npm run build`
Expected: 0 erros.

---

## Auto-Revisão do Plano (Self-Review Checklist)

1. **Spec Coverage:** Todas as heurísticas de Nielsen e critérios WCAG 2.2 apontados na `AUDITORIA_UI_UX_LABETA.md` estão atendidos pelas tarefas.
2. **Ergonomia do Admin:** Substitui os alertas nativos e o layout invasivo por uma experiência moderna, discreta e alinhada ao conceito de "Admin Invisível".
3. **Step Scan:** Cada passo tem um comando e entrega checável e atômica.
4. **Proporção e Foco:** O plano mantém a leveza da SPA sem adicionar bibliotecas pesadas de terceiros, aproveitando a stack nativa React + CSS moderno.
