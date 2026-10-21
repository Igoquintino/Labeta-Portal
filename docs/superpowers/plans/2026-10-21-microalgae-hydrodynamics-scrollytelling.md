# Plano de Implementação: Sistema Interativo de Hidrodinâmica e Scrollytelling de Microalgas (Lâmina Viva)

> **Para agentes de execução e engenheiros frontend:** SUB-SKILL OBRIGATÓRIA: Use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa. As etapas utilizam a sintaxe estrita de checkbox (`- [ ]`) para rastreamento sistemático e verificação contínua.

**Goal:** Transformar o plano de fundo do Portal LABETA em uma "lâmina viva de microscópio ficológico amazônico" interativa e fluida a 60 FPS, onde microalgas autênticas da bacia do Tapajós reagem à hidrodinâmica do scroll, ao campo de repulsão do mouse e à profundidade de campo óptica (Apple-like scrollytelling), adaptando-se harmonicamente aos modos escuro e claro sem degradar a acessibilidade nem a performance em conexões fluviais.

**Architecture:** Camada isolada de renderização via HTML5 Canvas 2D em tela cheia (`position: fixed; inset: 0; pointer-events: none; z-index: 0`) gerenciada fora do ciclo de render do React via `requestAnimationFrame` nativo, com Path2D pré-compilados em cache offscreen para espécimes ficológicos, física de amortecimento vetorial (*lerp* e fricção de Stokes), rastreador de momento desacoplado e ponte reativa através de `MicroscopeContext` integrado ao `ThemeContext` e a `prefers-reduced-motion`.

**Tech Stack:** React 19, HTML5 Canvas 2D API (GPU accelerated), Path2D, CSS Custom Properties (Tokens de 3 Camadas), Lucide React, Vitest + React Testing Library.

**Spec:** [`Rel_Audi_Plan/Plano Diretor de Implementação: Sistema Interativo de Hidrodinâmica e Scrollytelling de Microalgas (Lâmina Viva).md`](file:///home/igoquintino/Documentos/Desenvolvimento_Projetos/Front_Labeta/labeta-portal/Rel_Audi_Plan/Plano%20Diretor%20de%20Implementa%C3%A7%C3%A3o:%20Sistema%20Interativo%20de%20Hidrodin%C3%A2mica%20e%20Scrollytelling%20de%20Microalgas%20(L%C3%A2mina%20Viva).md)

---

## Global Constraints

1. **Taxa de Quadros & Orçamento de CPU:** Manter 60 FPS estáveis em desktop e 60/30 FPS em dispositivos móveis, sem acionar re-renderizações no Virtual DOM do React durante o ciclo de animação.
2. **Piso de Acessibilidade WCAG 2.2:** O canvas deve manter estritamente `pointer-events: none` e operar em `z-index: 0`, garantindo que toda a navegação por teclado, leitor de tela (NVDA/VoiceOver) e contraste de texto (mínimo de 4.5:1 para secundário e 7:1 para primário) permaneçam intocados.
3. **Respeito a `prefers-reduced-motion`:** Se a preferência do sistema operacional estiver ativa, congelar a hidrodinâmica de scroll e o empuxo radial, renderizando apenas um estado de dispersão estática sutil com transições graduais de opacidade.
4. **Economia de Bateria & Conectividade Fluvial:** Pausar o ciclo de `requestAnimationFrame` quando a aba estiver em segundo plano (`document.visibilityState === 'hidden'`). Clampar o Device Pixel Ratio (DPR) em no máximo `2.0` (`Math.min(window.devicePixelRatio, 2)`).
5. **Fidelidade Cromática Bi-Modo:** Sincronizar as cores das partículas diretamente com os tokens semânticos de `src/styles/theme.css`:
   - *Modo Escuro (Amazônia Noturna):* Frústulas em Dourado Aluvial (`#D6C28F`), plastos em Verde Clorofila (`#4EA86E`) e feixe óptico suave com opacidades entre `0.20` e `0.65`.
   - *Modo Claro (Amazônia Diurna):* Frústulas em Âmbar Fluvial (`#9E6700`), cloroplastos em Verde Floresta (`#165B33`) com efeito de campo claro/contraste de fase e opacidades entre `0.12` e `0.38`.

---

## Review Focus (Casos de Borda e Modos de Falha)

1. **Vazamento de Memória ao Trocar de Rota:** Instâncias de `requestAnimationFrame`, listeners de `scroll` e `mousemove` e referências ao canvas devem ser 100% destruídas na desmontagem do componente React.
2. **Resize de Janela e Distorção de Proporção:** Redimensionamentos da viewport (ou rotação de smartphone) não devem esticar as microalgas nem reiniciar a posição das partículas abruptamente; o sistema deve redimensionar o buffer do canvas e redistribuir suavemente as coordenadas de contorno.
3. **Scroll Rápido ou Fling Mobile:** Rolagens abruptas em touchscreens ou mouses com rolagem livre (*infinite wheel*) não podem arremessar as partículas para fora da tela indefinidamente; a velocidade do scroll deve sofrer limitação de teto (*velocity clamping*) e amortecimento exponencial $\lambda \approx 0.94$.
4. **Transição Dinâmica de Tema sem Recarregamento:** Ao alternar o tema via `ThemeToggle` (Sol/Lua), as partículas devem interpolar ou atualizar suas cores no próximo quadro sem congelamento ou flash de tela.
5. **Sobrecarga em Monitores de Alta Densidade (4K / Retina 3x):** Renderizar canvas em $3840 \times 2160$ com DPR 3x consome 33 milhões de pixels por quadro. O clamp para DPR 1.5–2.0 e o particionamento em camadas de profundidade Z previnem quedas drásticas de quadros.

---

## Estrutura de Arquivos e Componentes

```text
src/
├── components/
│   └── background/
│       ├── MicroalgaeCanvas.jsx          <-- Componente React que monta o Canvas e gerencia ciclo de vida
│       ├── MicroalgaeCanvas.css          <-- Estilos, z-index, vinheta óptica de microscópio e fallbacks
│       └── engine/
│           ├── PhysicsTracker.js         <-- Rastreador suavizado de scroll e mouse com lerp
│           ├── MicroalgaParticle.js      <-- Classe física da partícula com equações brownianas e zoom
│           ├── SpeciesRenderer.js        <-- Desenho vetorial de táxons reais (Eunotia, Micrasterias, Anabaena)
│           └── ParticleSystem.js         <-- Gerenciador do pool, culling espacial e loop 60 FPS
├── context/
│   ├── MicroscopeContext.jsx             <-- Provedor de estado da ocular (intensidade, foco e zoom)
│   └── useMicroscope.js                  <-- Hook de consumo em páginas específicas
test/
├── microscope-physics.test.js            <-- Testes unitários das equações físicas e decaimento
├── microscope-species.test.js            <-- Testes de renderização vetorial e resolução de cores
├── microscope-system.test.js             <-- Testes do gerenciador de partículas e resize
└── microscope-canvas.test.jsx            <-- Teste de integração React, reduced-motion e unmount
```

---

## Tarefas de Implementação

### Tarefa 1: Rastreador de Momento e Física de Entrada (`PhysicsTracker.js`)

**Objetivo:** Capturar o deslocamento do scroll e a posição do cursor do mouse de forma passiva, aplicando amortecimento linear (*lerp*) e calculando vetores de velocidade instantânea sem bloquear a thread principal.

**Arquivos:**
- Create: `src/components/background/engine/PhysicsTracker.js`
- Test: `test/microscope-physics.test.js`

- [ ] **Passo 1.1:** Criar o arquivo de teste `test/microscope-physics.test.js` cobrindo cálculo de delta de scroll, velocidade normalizada, amortecimento exponencial e clamp de velocidade máxima.
- [ ] **Passo 1.2:** Executar `npm test test/microscope-physics.test.js` e verificar que o teste falha (módulo inexistente).
- [ ] **Passo 1.3:** Implementar a classe `PhysicsTracker` em `src/components/background/engine/PhysicsTracker.js`:
  - Registrar ouvintes passivos: `window.addEventListener('scroll', ..., { passive: true })` e `window.addEventListener('mousemove', ..., { passive: true })`.
  - Suportar toque em mobile via `touchmove` passivo.
  - Manter variáveis de estado: `scrollY`, `lastScrollY`, `scrollVelocity`, `mouseX`, `mouseY`, `mouseVelocity`, `isMouseActive`.
  - Método `update(deltaTime)`: aplica decaimento por fricção ($\lambda \approx 0.93$) na velocidade do scroll e interpolação linear no cursor do mouse.
  - Método `destroy()`: remove todos os event listeners com rigor.
- [ ] **Passo 1.4:** Executar `npm test test/microscope-physics.test.js` e verificar aprovação completa.

---

### Tarefa 2: Modelo Físico da Partícula de Alga (`MicroalgaParticle.js`)

**Objetivo:** Encapsular o comportamento individual de cada organismo em suspensão na lâmina viva, integrando movimento browniano, impulso hidrodinâmico, repulsão do mouse e profundidade de campo $Z$.

**Arquivos:**
- Create: `src/components/background/engine/MicroalgaParticle.js`
- Modify: `test/microscope-physics.test.js`

- [ ] **Passo 2.1:** Expandir `test/microscope-physics.test.js` com testes unitários para a classe `MicroalgaParticle`:
  - Inicialização estocástica dentro dos limites de largura e altura.
  - Cálculo da oscilação browniana $x_{drift}, y_{drift}$ com frequência angular e fase individual.
  - Reação ao vetor de scroll proporcional à profundidade $z \in [0.1, 1.0]$.
  - Reação de repulsão radial ao feixe do mouse quando dentro do raio de influência $R$.
  - Efeito de escala por zoom focal Apple-like.
- [ ] **Passo 2.2:** Executar `npm test test/microscope-physics.test.js` e verificar falha dos novos testes.
- [ ] **Passo 2.3:** Implementar a classe `MicroalgaParticle` em `src/components/background/engine/MicroalgaParticle.js`:
  - Construtor: sorteia espécie (`diatom-navicula`, `diatom-centric`, `desmid-micrasterias`, `cyanobacteria-filament`, `organic-debris`), posição $(x, y)$, profundidade $z \in [0.15, 1.0]$, rotação inicial $\theta_0$, velocidade angular $\omega_{rot}$ e amplitude de deriva $A_x, A_y$.
  - Método `applyForces(physicsTracker, zoomFactor, viewportWidth, viewportHeight)`:
    * **Deriva Browniana:** $x \mathrel{+}= A_x \cdot \sin(\omega_x t + \phi_i) \cdot z$.
    * **Empuxo Hidrodinâmico:** $v_y \mathrel{+}= v_{scroll} \cdot k_{força} \cdot z$; adicionar pequena turbulência lateral $v_x \mathrel{+}= v_{scroll} \cdot \text{random}(-0.25, 0.25) \cdot z$.
    * **Repulsão do Mouse:** se a distância $d < R_{influencia}$, acelerar radialmente na direção oposta com força inversamente proporcional à distância e retorno amortecido por mola.
    * **Wrap-around toroidal:** se a partícula ultrapassar as bordas com margem de segurança (bounding box da espécie), reaparecer suavemente na borda oposta preservando velocidade.
- [ ] **Passo 2.4:** Executar `npm test test/microscope-physics.test.js` e validar aprovação de todos os casos.

---

### Tarefa 3: Renderizador de Espécies Amazônicas (Sprites WebP Reais & Path2D) (`SpeciesRenderer.js`)

**Objetivo:** Renderizar com altíssima fidelidade estética e científica tanto os espécimes fotomicroscópicos reais fornecidos pelo laboratório quanto os espécimes procedurais complementares, com cache de imagens e suporte a variações de iluminação para os modos Dark e Light.

**Arquivos:**
- Create: `src/components/background/engine/SpeciesRenderer.js`
- Create: `test/microscope-species.test.js`

- [ ] **Passo 3.1:** Criar `test/microscope-species.test.js` validando o carregamento do pool de sprites (`public/diatom_img/Diatom_*.webp`), tratamento de fallbacks, renderização das espécies procedurais e filtros de cor para Dark/Light.
- [ ] **Passo 3.2:** Executar `npm test test/microscope-species.test.js` e verificar falha.
- [ ] **Passo 3.3:** Implementar `SpeciesRenderer` em `src/components/background/engine/SpeciesRenderer.js`:
  - **Sprites Fotomicroscópicos Reais (`public/diatom_img/`):**
    * Mapeamento de `Diatom_1.webp`, `Diatom_2.webp`, `Diatom_3.webp` e `Diatom_.webp` com `HTMLImageElement` em cache estático.
    * Desenho via `ctx.drawImage` com preservação de aspecto, rotação angular $\theta$, escala de profundidade $z$ e alpha blending translúcido.
    * No Dark Mode: brilho sutil com realce dourado vítreo; no Light Mode: contraste de fase com leve tonalidade âmbar-oliva (`#9E6700`).
  - **Espécimes Procedurais Complementares (Path2D pré-compilados):**
    * **Desmídia Bilateral (*Micrasterias*):** Semicélulas espelhadas com incisões lobadas características e núcleos de cloroplastos verdes (`--color-green-500` no Dark / `--color-green-700` no Light).
    * **Cianobactéria Filamentosa (*Anabaena*):** Cadeia senoidal ondulante de células esferoides conectadas com heterocistos ocasionais.
    * **Micropartículas de Seston Fluvial:** Pontos diminutos de areia fina e matéria orgânica em suspensão translúcida.
- [ ] **Passo 3.4:** Executar `npm test test/microscope-species.test.js` e verificar aprovação completa.

---

### Tarefa 4: Gerenciador de Partículas e Loop de Execução (`ParticleSystem.js`)

**Objetivo:** Coordenar a população de partículas, gerenciar o buffer do canvas, calcular o redimensionamento dinâmico e manter o loop `requestAnimationFrame` rodando a 60 FPS com orçamentação adaptativa por dispositivo.

**Arquivos:**
- Create: `src/components/background/engine/ParticleSystem.js`
- Create: `test/microscope-system.test.js`

- [ ] **Passo 4.1:** Criar `test/microscope-system.test.js` testando inicialização com contagem proporcional à largura da tela, execução de passos de simulação (`tick`), pausa/retomada do loop e ajuste de tema.
- [ ] **Passo 4.2:** Executar `npm test test/microscope-system.test.js` e verificar falha.
- [ ] **Passo 4.3:** Implementar `ParticleSystem` em `src/components/background/engine/ParticleSystem.js`:
  - **Dimensionamento Adaptativo (Particle Budget):**
    * Mobile ($< 768\text{px}$): 20 a 28 espécimes.
    * Tablet ($768\text{px}$ a $1024\text{px}$): 35 a 45 espécimes.
    * Desktop ($> 1024\text{px}$): 55 a 70 espécimes.
  - **Tratamento de Retina/DPR:** Configurar `canvas.width = Math.floor(width * dpr)` e `canvas.height = Math.floor(height * dpr)` com `ctx.scale(dpr, dpr)`. Clampar DPR máximo em `2.0`.
  - **Ordenação por Eixo Z (Depth Sorting):** Desenhar partículas da camada mais profunda ($z \approx 0.1$) para a mais superficial ($z \approx 1.0$), garantindo oclusão e desfoque visual coerentes.
  - **Suporte a Pausa / Visibilidade:** Interromper a fila de rAF se `isPaused` for verdadeiro ou se a aba estiver oculta.
  - **Modo Estático (Reduced Motion):** Se reduzido, desenha apenas um quadro inicial estático com posicionamento suave e não agenda novas execuções no rAF.
- [ ] **Passo 4.4:** Executar `npm test test/microscope-system.test.js` e validar aprovação.

---

### Tarefa 5: Componente React do Canvas e Folha de Estilos (`MicroalgaeCanvas.jsx` e `.css`)

**Objetivo:** Fornecer o componente React limpo que monta o canvas fixo sob o portal, conecta os listeners de ciclo de vida e renderiza a vinheta óptica sutil de microscópio.

**Arquivos:**
- Create: `src/components/background/MicroalgaeCanvas.jsx`
- Create: `src/components/background/MicroalgaeCanvas.css`
- Create: `test/microscope-canvas.test.jsx`

- [ ] **Passo 5.1:** Criar `test/microscope-canvas.test.jsx` testando a montagem do `<canvas>`, atribuição de classes CSS, comportamento perante `window.matchMedia('(prefers-reduced-motion: reduce)')` e destruição completa dos recursos ao desmontar.
- [ ] **Passo 5.2:** Executar `npm test test/microscope-canvas.test.jsx` e verificar falha.
- [ ] **Passo 5.3:** Criar a folha de estilos `src/components/background/MicroalgaeCanvas.css`:
  - Canvas com posicionamento fixo: `position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: var(--z-microscope, 0);`.
  - Vinheta óptica suave de microscópio (`.microscope-vignette`): gradiente radial suave simulando a borda da ocular de vidro sem comprometer a leitura do texto nas extremidades.
  - Ajuste de opacidade global adaptável ao tema:
    * Dark: transparência vítrea natural.
    * Light: leve descoloração e suavização para não concorrer com os cards brancos.
- [ ] **Passo 5.4:** Implementar o componente `MicroalgaeCanvas.jsx`:
  - Hook `useTheme` para sincronizar o modo claro/escuro com a engine de partículas em tempo real.
  - `ResizeObserver` no container ou ouvinte de `window.resize` com *debounce*.
  - Ouvinte de `document.addEventListener('visibilitychange')` para pausar em abas inativas.
  - Ouvinte de `window.matchMedia('(prefers-reduced-motion: reduce)')` com reação dinâmica se o usuário alterar a preferência com a página aberta.
- [ ] **Passo 5.5:** Executar `npm test test/microscope-canvas.test.jsx` e confirmar que passa com 100% de sucesso.

---

### Tarefa 6: Contexto de Controle da Ocular e Calibração por Página (`MicroscopeContext.jsx`)

**Objetivo:** Permitir que páginas ou seções individuais do portal ajustem o foco da lâmina (ex.: aumentar turbulência e zoom na Home para efeito cinematográfico, diminuir densidade em `/trabalhos` e `/agendamento` para máxima concentração na leitura).

**Arquivos:**
- Create: `src/context/MicroscopeContext.jsx`
- Create: `src/context/useMicroscope.js`
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Works.jsx`
- Modify: `src/pages/Booking.jsx`

- [ ] **Passo 6.1:** Criar `src/context/MicroscopeContext.jsx` e hook `src/context/useMicroscope.js` provendo parâmetros configuráveis:
  - `mode`: `'cinematic'` (Home), `'ambient'` (páginas de catálogo/artigos), `'minimal'` (agendamento).
  - `intensity`: multiplicador de velocidade ($0.0$ a $1.5$).
  - `zoom`: fator óptico da ocular ($0.8\times$ a $1.4\times$).
  - `setMicroscopeConfig(config)`: função para páginas injetarem suas preferências temporárias ao montar.
- [ ] **Passo 6.2:** Integrar o `MicroscopeProvider` e o `MicroalgaeCanvas` no `src/App.jsx`, envolvendo as rotas logo acima do `main-content` e preservando o `z-index: 0`.
- [ ] **Passo 6.3:** Configurar calibração refinada na Home (`Home.jsx`):
  - No Hero (`HeroMosaic`), a lâmina atua com zoom amplo panorâmico ($10\times$).
  - Ao rolar para "Sobre o LABETA" (`AboutSection`), o zoom aproxima suavemente ($40\times$) e a densidade de diatomáceas douradas aumenta sutilmente.
  - Ao rolar para "Normas de Biossegurança" (`RulesSection`), a correnteza abranda, evocando a calmaria das amostras estabilizadas na bancada analítica.
- [ ] **Passo 6.4:** Nas páginas de leitura intensiva (`Works.jsx`, `People.jsx`, `News.jsx`, `Lab.jsx`, `Booking.jsx`):
  - Ajustar intensidade para `'ambient'` com opacidade reduzida ($0.15$ no Dark / $0.08$ no Light), transformando as microalgas em uma textura de fundo discreta e elegante que não compete visualmente com textos científicos e formulários.

---

### Tarefa 7: Atualização dos Design Tokens e Camada Z-Index (`theme.css`)

**Objetivo:** Incorporar formalmente os tokens da lâmina viva e da ocular nas camadas 2 e 3 do design system, garantindo coerência visual e conformidade absoluta de contraste em ambos os temas.

**Arquivos:**
- Modify: `src/styles/theme.css`
- Modify: `test/theme-tokens.test.js`
- Modify: `test/theme-tokens-light.test.js`

- [ ] **Passo 7.1:** Adicionar ao `theme.css`:
  - Token de camada Z: `--z-microscope: 0;` e assegurar que `--z-base: 1;`.
  - Tokens semânticos de microalgas no `:root` (Modo Escuro):
    * `--microscope-diatom: var(--color-gold-400);`
    * `--microscope-chlorophyll: var(--color-green-500);`
    * `--microscope-cyan: var(--color-blue-400);`
    * `--microscope-fluid-opacity: 0.35;`
  - Tokens correspondentes no bloco `[data-theme='light']` (Modo Claro):
    * `--microscope-diatom: #9E6700;` (Âmbar aluvial escuro)
    * `--microscope-chlorophyll: #165B33;` (Verde floresta profundo)
    * `--microscope-cyan: #0284C7;` (Azul fluvial)
    * `--microscope-fluid-opacity: 0.18;`
- [ ] **Passo 7.2:** Atualizar `test/theme-tokens.test.js` e `test/theme-tokens-light.test.js` para validar a presença e consistência dos novos tokens.
- [ ] **Passo 7.3:** Executar `npm test` e verificar que todos os testes de tokens continuam passando.

---

### Tarefa 8: Homologação Integrada, Testes de Performance e Build de Produção

**Objetivo:** Verificar a ausência de regressões em todo o portal, aferir o consumo de memória, assegurar a execução limpa do linter e compilar o build de produção sem alertas.

**Arquivos:**
- Test: Suíte completa (`npm test`)
- Run: `npm run lint`
- Run: `npm run build`

- [ ] **Passo 8.1:** Executar a suíte completa de testes unitários e de integração (`npm test`) e garantir que 100% dos testes passem (mínimo de 85+ testes com os novos módulos da lâmina viva).
- [ ] **Passo 8.2:** Executar o linter ESLint (`npm run lint`) garantindo zero erros ou avisos de código não utilizado.
- [ ] **Passo 8.3:** Executar a compilação do Vite (`npm run build`) validando que o pacote compilado não gera warnings de tamanho excessivo de chunks e que a inclusão da engine de partículas não aumentou o bundle em mais de 10 KB.
- [ ] **Passo 8.4:** Validar manualmente com a ferramenta de inspeção do navegador que o FPS permanece travado em 60 FPS durante a rolagem contínua na Home e que a CPU permanece em $< 3\%$ em repouso.

---

## Métricas de Sucesso da Implementação

1. **Taxa de Quadros:** $\ge 58\text{ FPS}$ sustentados em desktop e $\ge 50\text{ FPS}$ em smartphones intermediários durante scroll rápido.
2. **Impacto no Pacote (Bundle Size):** Acréscimo inferior a $10\text{ kB}$ (gzipped) no JavaScript final (sem dependências externas como Three.js ou PixiJS — 100% Canvas 2D nativo).
3. **Acessibilidade Digital:** Zero violações na árvore de acessibilidade; todos os botões, links e leitores de tela operam com foco desimpedido.
4. **Respeito às Preferências:** Comutação instantânea e graciosa com `prefers-reduced-motion` e alternador Dark/Light.
5. **Impacto Estético e Identidade:** Alinhamento exemplar à identidade científica do LABETA/UFOPA, consagrando a experiência de microscopia óptica fluida da Amazônia.
