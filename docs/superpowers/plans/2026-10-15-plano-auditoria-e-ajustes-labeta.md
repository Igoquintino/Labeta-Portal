# Plano de Ajustes, Auditoria e Estabilização dos Updates (LABETA)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Estabilizar, corrigir e finalizar as modificações e acréscimos recentes do Portal LABETA (arquitetura "Admin Invisível", integração Supabase, iframe de agendamento e controles de gestão), eliminando erros de lint, corrigindo falhas de acessibilidade e substituindo placeholders mock por fluxos operacionais resilientes.

**Architecture:** Manter a aplicação como SPA estática em React 19 + Vite com hospedagem simplificada para o CTIC/UFOPA, utilizando Supabase como Backend-as-a-Service discreto para autenticação por Magic Link e validação de whitelist na tabela `admins`. Prover modais de gestão inline protegidos pela flag `isAdmin` do `AuthContext`, preservando a experiência 100% limpa para o público externo e garantindo conformidade com as diretrizes do `.agentcontext` e da `AUDITORIA_UI_UX_LABETA.md`.

**Tech Stack:** React 19, Vite 8, React Router Dom 7, `@supabase/supabase-js` 2.x, `lucide-react`, CSS Moderno nativo com variáveis customizadas (`theme.css`).

**Spec:**
- `labeta-portal/AUDITORIA_UI_UX_LABETA.md`
- `labeta-portal/src/Relatório de Implementação Funcional: Arquitetura "Admin Invisível.md`
- `labeta-portal/src/RELATORIO_CUMULATIVO_LABETA.md`
- `labeta-portal/src/.agentcontext` e `labeta-portal/src/DOCUMENTO_REQUISITOS_LABETA.md`

---

## Global Constraints

- **Identidade Visual Imutável:** Manter estritamente o conceito Dark / Amazônia Noturna: Fundo Base `#0C120F`, Cards `#14241B`, Verde Institucional `#165B33`, Dourado `#D6C28F`, Verde Clorofila `#4EA86E`, Texto `#F4F7F4` e `#A0B0A4`.
- **Admin Invisível:** Nenhum botão público de Login/Admin na Navbar ou no rodapé para usuários deslogados; acesso exclusivamente por rota direta `/admin` ou atalho no Spotlight.
- **Higiene de Build & Linter:** O comando `npm run lint` e `npm run build` devem rodar com 0 erros e 0 warnings.
- **Compatibilidade React 19:** Não utilizar `import React from 'react'`; exportar hooks em conformidade com o Fast Refresh do Vite.
- **Segurança Supabase:** Nunca expor chaves Service Role; utilizar apenas Anon Key pública com Row Level Security (RLS) habilitado.

---

## Review Focus

1. **Credenciais Supabase Ausentes ou Inválidas:** O portal não pode quebrar com tela branca ou crash fatal se as variáveis de ambiente `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` estiverem indefinidas; deve emitir aviso silencioso e operar em modo estático/read-only sem erros no console.
2. **Navegação de Usuário Não-Admin em Rotas Restritas:** Acessar `/admin` sem credenciais deve exibir formulário limpo; usuários logados sem e-mail na whitelist devem ver badge de "Sem permissão" e nenhuma ação administrativa nas páginas públicas.
3. **Persistência de Sessão e Atualização em Tempo Real:** Ao fazer login via Magic Link, a flag `isAdmin` deve revalidar dinamicamente e exibir os botões de ação sem exigir recarregamento forçado da página (F5).
4. **Responsividade do Iframe de Agendamento:** O embed do Google Agenda em `Booking.jsx` não pode transbordar horizontalmente em telas pequenas (< 554px) nem expor contas pessoais de e-mail ao público.
5. **Links de Lattes Incompletos / Placeholders:** Em `People.jsx`, membros com Lattes `0000000000000000` ou vazio não devem abrir link quebrado do CNPq; devem exibir badge textual neutro "Currículo em atualização".

---

## Matriz de Avaliação dos Pontos Atualizados/Modificados

| Arquivo / Módulo Atualizado | Classificação | Ponto Positivo (Bom) | Ponto Crítico / Alerta | Ação Requerida no Plano |
| :--- | :---: | :--- | :--- | :--- |
| `src/services/supabase.js` | ⚠️ **Alerta** | Inicialização centralizada e modular do cliente Supabase. | Crash fatal se `.env` estiver vazio; falta verificação preventiva e mock seguro. | Tratar inicialização com fallback resiliente para ambiente local. |
| `src/context/AuthContext.jsx` | 🛑 **Crítico** | Autenticação reativa por Magic Link; observador de sessão contínuo. | 2 erros de ESLint (`React` unused e `react-refresh/only-export-components`). RLS precisa de validação de erro de rede. | Corrigir imports do React 19, desacoplar hook `useAuth` e tratar erros de conexão. |
| `src/pages/AdminLogin.jsx` | 🛑 **Crítico** | Visual alinhado ao tema dark; fluxo claro de Magic Link com feedback. | 1 erro de ESLint (`React` unused); uso excessivo de inline styles; sem atalho de acesso. | Corrigir lint, migrar estilos inline para CSS dedicado e integrar com atalho `:admin` do Spotlight. |
| `src/App.jsx` | 🛑 **Crítico** | Rota `/admin` isolada e invisível na navegação comum. | 1 erro de ESLint (`supabase` unused). Falta skip-link de acessibilidade. | Remover import não usado de `supabase` e adicionar skip-to-content. |
| `src/index.css` | 🟢 **Bom** | Classes semânticas para toolbar e botões de ação administrativa com backdrop blur. | Cores hardcoded (`#E07A5F`) fora dos tokens de `theme.css`. | Registrar cores de alerta no design system de tokens em `theme.css`. |
| `src/pages/Booking.jsx` | 🛑 **Crítico** | Embed do Google Calendar funcional com `loading="lazy"`. | Botões admin disparam `alert()`; iframe com e-mail pessoal e largura fixa de 554px quebrando mobile. | Substituir `alert()` por modais funcionais, parametrizar URL da agenda e tornar iframe 100% fluido. |
| `src/pages/Lab.jsx` | 🟢 **Bom** | Correção de `<a href>` para `<Link to>` eliminando reload SPA. | Ações admin de espaço e protocolo disparam `alert()`. | Integrar modais contextuais para edição e cadastro de espaços e etapas. |
| `src/pages/News.jsx` | ⚠️ **Alerta** | Separação lógica impecável entre Comunicados e Radar Científico. | Ações acionam `alert()`; dados continuam lidos estaticamente sem persistência. | Implementar modal de criação e edição com validação de dados. |
| `src/pages/People.jsx` | ⚠️ **Alerta** | Renomeação correta de `Peaple.jsx` para `People.jsx`; toolbar integrada. | Ações chamam `alert()`; links Lattes `0000000000000000` ainda clicáveis. | Desabilitar link de Lattes inválido e criar modal de gerenciamento de membros. |
| `src/pages/Works.jsx` | ⚠️ **Alerta** | Toolbar e botões inline preservam a reatividade do filtro e busca. | Ações chamam `alert()`; links externos não avisam que abrem em nova aba. | Implementar modal de trabalhos e adicionar `aria-label` para links externos com DOI. |
| `src/Relatório de Implementação...` | ⚠️ **Atenção** | Documentação detalhada e didática de toda a mecânica "Admin Invisível". | Arquivo `.md` solto dentro de `src/`, poluindo a pasta de código-fonte. | Mover para `docs/relatorios/` mantendo histórico organizado. |
| Estado Git (`labeta-portal`) | 🛑 **Crítico** | Todos os conflitos foram sanados. | Merge pendente com `origin/main` (commit remoto de exclusão de README.md). | Concluir merge com segurança e criar commit limpo. |

---

## Tarefas de Implementação

### Task 1: Higiene Imediata de Código e Resolução do Linter (4 Erros)

**Files:**
- Modify: `labeta-portal/src/App.jsx:1-12`
- Modify: `labeta-portal/src/pages/AdminLogin.jsx:1-10`
- Modify: `labeta-portal/src/context/AuthContext.jsx:1-15,80-87`
- Create: `labeta-portal/src/context/useAuth.js`

**Interfaces:**
- Consumes: `supabase` from `../services/supabase`
- Produces: `useAuth()` hook compatível com Fast Refresh e sem erros de ESLint.

- [ ] **Step 1: Criar arquivo de hook isolado `src/context/useAuth.js`**
Extrair o hook `useAuth` para arquivo próprio para satisfazer `react-refresh/only-export-components`.

- [ ] **Step 2: Remover imports desnecessários de `React` e `supabase`**
Em `src/App.jsx`, remover `import { supabase } from './services/supabase';`.
Em `src/pages/AdminLogin.jsx`, alterar linha 1 para `import { useState } from 'react';`.
Em `src/context/AuthContext.jsx`, alterar linha 1 para `import { createContext, useState, useEffect } from 'react';`.

- [ ] **Step 3: Executar linter para verificar conformidade**
Run: `cd labeta-portal && npm run lint`
Expected: `0 problems`

- [ ] **Step 4: Executar build de produção**
Run: `cd labeta-portal && npm run build`
Expected: `✓ built in ...ms`

- [ ] **Step 5: Concluir merge pendente no Git**
Finalizar o merge aberto com mensagem descritiva:
```bash
cd labeta-portal
git add src/App.jsx src/context/ src/pages/AdminLogin.jsx
git commit -m "fix(core): resolve lint issues, decouple useAuth hook and complete merge"
```

---

### Task 2: Resiliência de Conexão Supabase e Fallback Seguro

**Files:**
- Modify: `labeta-portal/src/services/supabase.js`
- Modify: `labeta-portal/src/context/AuthContext.jsx`
- Create: `labeta-portal/.env.example`

**Interfaces:**
- Consumes: `import.meta.env.VITE_SUPABASE_URL`, `import.meta.env.VITE_SUPABASE_ANON_KEY`
- Produces: Objeto `supabase` resiliente com verificação de integridade sem crash em runtime.

- [ ] **Step 1: Criar template `.env.example`**
Registrar as variáveis necessárias sem valores sensíveis:
```env
VITE_SUPABASE_URL=https://exemplo.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

- [ ] **Step 2: Blindar inicialização do Supabase em `src/services/supabase.js`**
Adicionar verificação condicional: se as variáveis estiverem ausentes, instanciar cliente com valores mock ou emitir warning seguro sem abortar a renderização da aplicação.

- [ ] **Step 3: Proteger verificação de status em `AuthContext.jsx`**
Adicionar bloco `try/catch` com fallback para `setIsAdmin(false)` e timeout controlado para evitar travamento em caso de indisponibilidade do serviço.

- [ ] **Step 4: Validar build e execução de testes de ponta**
Run: `cd labeta-portal && npm run build`
Expected: PASS sem avisos de import quebrado.

---

### Task 3: Acessibilidade e Responsividade no Embed do Google Agenda (`Booking.jsx`)

**Files:**
- Modify: `labeta-portal/src/pages/Booking.jsx`
- Modify: `labeta-portal/src/pages/Booking.css`

**Interfaces:**
- Consumes: `useAuth`
- Produces: Container responsivo de iframe que se adapta a telas mobile (< 554px) e parametrização institucional do calendário.

- [ ] **Step 1: Envolver iframe em wrapper fluido com `max-width: 100%`**
Substituir o atributo fixo `width="554"` por estilo responsivo em `Booking.css`:
```css
.calendar-embed-container {
    width: 100%;
    overflow: hidden;
    border-radius: var(--radius-md);
}
.calendar-iframe {
    width: 100%;
    max-width: 100%;
    min-height: 400px;
    border: none;
}
```

- [ ] **Step 2: Adicionar fallback acessível**
Incluir link textual direto para consulta da agenda para usuários de tecnologias assistivas ou conexões de baixa velocidade.

- [ ] **Step 3: Testar responsividade e lint**
Run: `cd labeta-portal && npm run lint && npm run build`
Expected: 0 erros.

---

### Task 4: Eliminação de Links Quebrados de Lattes e Correção A11y em `People.jsx`

**Files:**
- Modify: `labeta-portal/src/pages/People.jsx`
- Modify: `labeta-portal/src/pages/People.css`

**Interfaces:**
- Consumes: `member.lattes`
- Produces: Renderização condicional do botão Lattes (exibição de link real quando válido; badge neutro "Lattes em atualização" quando nulo ou preenchido com zeros).

- [ ] **Step 1: Criar helper de validação de Lattes**
```javascript
const isValidLattes = (url) => {
    return url && !url.includes('0000000000000000') && url.startsWith('http');
};
```

- [ ] **Step 2: Aplicar renderização condicional no card**
Se `isValidLattes(member.lattes)` for verdadeiro, renderizar `<a href={member.lattes} target="_blank" rel="noopener noreferrer">`. Caso contrário, renderizar tag desabilitada acessível com `aria-label="Currículo Lattes não informado"`.

- [ ] **Step 3: Validar visualmente e via linter**
Run: `cd labeta-portal && npm run lint`
Expected: 0 erros.

---

### Task 5: Substituição dos Modais Mock (`alert()`) por Modais de Gestão Funcionais

**Files:**
- Create: `labeta-portal/src/components/admin/AdminModal.jsx`
- Create: `labeta-portal/src/components/admin/AdminModal.css`
- Modify: `labeta-portal/src/pages/News.jsx`
- Modify: `labeta-portal/src/pages/Works.jsx`
- Modify: `labeta-portal/src/pages/People.jsx`
- Modify: `labeta-portal/src/pages/Lab.jsx`
- Modify: `labeta-portal/src/pages/Booking.jsx`

**Interfaces:**
- Consumes: `isOpen`, `onClose`, `title`, `children`, `onSave`
- Produces: Diálogo modal acessível com armadilha de foco (*focus trap*), fechamento por `Esc` e persistência de dados local/Supabase.

- [ ] **Step 1: Construir componente `AdminModal.jsx` reutilizável**
Com backdrop escuro, bloqueio de rolagem (`overflow: hidden`), tecla `Esc`, e formulário com campos semânticos.

- [ ] **Step 2: Substituir chamadas `alert()` em `News.jsx`**
Conectar os botões `Novo Comunicado`, `Novo Artigo Radar`, `Editar` e `Excluir` ao estado do modal.

- [ ] **Step 3: Substituir chamadas `alert()` em `People.jsx`, `Works.jsx`, `Lab.jsx` e `Booking.jsx`**
Vincular formulários de edição e remoção com confirmação acessível.

- [ ] **Step 4: Executar validação de linter e build**
Run: `cd labeta-portal && npm run lint && npm run build`
Expected: 0 erros.

---

### Task 6: Organização Documental e Higienização de `src/`

**Files:**
- Move: `labeta-portal/src/Relatório de Implementação Funcional: Arquitetura "Admin Invisível.md` -> `labeta-portal/docs/relatorios/relatorio-implementacao-admin-invisivel.md`
- Modify: `labeta-portal/README.md`

- [ ] **Step 1: Criar diretório `docs/relatorios/` e mover o arquivo de relatório**
```bash
mkdir -p labeta-portal/docs/relatorios/
mv "labeta-portal/src/Relatório de Implementação Funcional: Arquitetura \"Admin Invisível.md" "labeta-portal/docs/relatorios/relatorio-implementacao-admin-invisivel.md"
```

- [ ] **Step 2: Garantir que `src/` contenha apenas código-fonte e assets válidos**
Verificar ausência de arquivos `.md` soltos no diretório `src/`.

---

## Auto-Revisão do Plano (Self-Review Checklist)

1. **Spec Coverage:** Todas as pendências e alertas apontados nos relatórios do projeto (`AUDITORIA_UI_UX_LABETA.md`, `RELATORIO_CUMULATIVO_LABETA.md` e no relatório do "Admin Invisível") que incidem sobre os arquivos alterados/adicionados estão cobertos por tarefas de implementação claras.
2. **Step Scan:** Cada passo tem um comando de execução e resultado esperado explícito, eliminando ambiguidades para quem for executar.
3. **Type / Interface Consistency:** O hook `useAuth` é extraído para `src/context/useAuth.js` e consumido de maneira idêntica em todas as páginas sem quebrar o Fast Refresh do Vite.
4. **Review Focus:** Os 5 cenários críticos (Supabase sem credenciais, não-admin em rotas restritas, reatividade da sessão, responsividade do iframe e links Lattes nulos) estão endereçados nas tarefas correspondentes.
5. **Proportion:** O plano é conciso, modular e direto ao ponto, priorizando estabilização e entrega técnica consistente.
