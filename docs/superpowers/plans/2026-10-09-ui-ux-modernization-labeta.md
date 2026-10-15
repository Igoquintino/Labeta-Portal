# LABETA UI/UX Modernization & Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Transform the LABETA web portal into an accessible (WCAG 2.2 AA compliant), responsive, and aesthetically polished scientific platform by addressing all critical UI/UX flaws, routing bugs, linter errors, and design token gaps identified in the comprehensive audit.

**Architecture:** Refactor the native CSS architecture into a 3-layer design token system (`theme.css`), implement semantic HTML5/ARIA patterns across global components (Navbar, Spotlight Search, Carousel, Modals), fix SPA routing glitches, provide high-quality fallback assets, and clean up React 19 component lifecycle hygiene without introducing heavy runtime dependencies.

**Tech Stack:** React 19, Vite, React Router v7, Lucide React, Modern CSS3 with Custom Properties (Native CSS Modules / BEM scoped), ESLint 9/10 flat config.

---

## File Structure Overview

### Files to Create / Rename:
- `src/pages/People.jsx` (Renamed from `Peaple.jsx` to fix orthographic bug)
- `src/pages/People.css` (Renamed from `Peaple.css`)
- `public/placeholders/bancada.svg` (Thematic placeholder asset for bench activity)
- `public/placeholders/microscopio.svg` (Thematic placeholder asset for microscopy)
- `public/placeholders/campo.svg` (Thematic placeholder asset for field expeditions)

### Files to Delete:
- `src/components/home/RulesAccordion.jsx` (Orphan 0-byte file)
- `src/pages/Peaple.jsx` (Replaced by `People.jsx`)
- `src/pages/Peaple.css` (Replaced by `People.css`)

### Files to Modify:
- `index.html`: Set `lang="pt-BR"`, update title, meta description, and valid favicon link.
- `src/App.jsx`: Add accessible skip-link, update route imports for `People`.
- `src/styles/theme.css`: Implement 3-tier design token architecture, focus rings, and typography.
- `src/components/common/Navbar.jsx` & `Navbar.css`: OS-aware shortcut (`Ctrl+K` vs `⌘K`), non-shifting mobile drawer with backdrop and body scroll lock.
- `src/components/home/HeroMosaic.jsx` & `HeroMosaic.css`: Fix SVG dimensions (`width: 100%`), mobile mosaic layout, placeholder fallbacks.
- `src/components/home/AboutSection.jsx` & `AboutSection.css`: Remove duplicated introductory text, replace `text-align: justify` with accessible left-aligned readable column.
- `src/components/home/RulesSection.jsx`: Progressive disclosure (open first rule, collapse remaining).
- `src/components/home/RecentNewsSection.jsx` & `RecentNewsSection.css`: Standardize line clamp, visual taxonomy pills.
- `src/components/home/CarouselNavigation.jsx` & `CarouselNavigation.css`: Accessible pause/play controls (WCAG 2.2.2), touch swipe gestures, visible mobile controls.
- `src/components/modals/SpotlightSearch.jsx` & `SpotlightSearch.css`: Multi-collection real data search, keyboard navigation (`↑`, `↓`, `Enter`), fix synchronous effect setState bug.
- `src/components/modals/ContactModal.jsx` & `ContactModal.css`: Focus trap, accessible copy announcement (`aria-live="polite"`).
- `src/pages/Works.jsx`: Add real-time text query filtering, external link announcements.
- `src/pages/People.jsx`: Handle invalid/placeholder Lattes URLs gracefully.
- `src/pages/Lab.jsx`: Replace `<a href="/agendamento">` with `<Link to="/agendamento">`, unify campus address.
- `src/components/common/Footer.jsx`: Unify campus address to match official requirements.

---

### Task 1: Global HTML Metadata, Accessibility Foundation & Orphan File Cleanup

**Files:**
- Modify: `index.html`
- Modify: `src/App.jsx`
- Modify: `src/styles/theme.css`
- Delete: `src/components/home/RulesAccordion.jsx`

- [x] **Step 1: Delete orphan file `RulesAccordion.jsx`**

Run:
```bash
rm src/components/home/RulesAccordion.jsx
```

Verify deletion:
```bash
ls src/components/home/RulesAccordion.jsx 2>&1
# Expected output: No such file or directory
```

- [x] **Step 2: Update `index.html` with correct language, title, and favicon**

Replace contents of `index.html`:
```html
<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/logo-labeta.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="LABETA - Laboratório de Ecologia e Taxonomia de Algas da UFOPA. Pesquisa científica e biodiversidade aquática na Amazônia." />
  <meta name="theme-color" content="#0C120F" />
  <title>LABETA – Laboratório de Ecologia e Taxonomia de Algas | UFOPA</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>
```

- [x] **Step 3: Add accessible Skip-Link to `src/App.jsx`**

Update `src/App.jsx` to render `<a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>`:
```jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { ContactModal } from './components/modals/ContactModal';
import { SpotlightSearch } from './components/modals/SpotlightSearch';
import { Works } from './pages/Works';
import { People } from './pages/Peaple'; // Will be updated in Task 2
import { Lab } from './pages/Lab';
import { Booking } from './pages/Booking';
import { News } from './pages/News';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="app-layout">
      {/* Acessibilidade: Pular para o Conteúdo Principal */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trabalhos" element={<Works />} />
        <Route path="/pessoas" element={<People />} />
        <Route path="/laboratorio" element={<Lab />} />
        <Route path="/agendamento" element={<Booking />} />
        <Route path="/noticias" element={<News />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
```

- [x] **Step 4: Add styling for `.skip-link` in `src/styles/theme.css`**

Append to `src/styles/theme.css`:
```css
/* Link de salto de navegação acessível */
.skip-link {
    position: absolute;
    top: -100px;
    left: 1rem;
    background-color: var(--color-brand);
    color: var(--text-main);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    border: 2px solid var(--color-gold);
    z-index: 9999;
    font-weight: 600;
    text-decoration: none;
    transition: top 0.2s ease;
}

.skip-link:focus {
    top: 1rem;
    outline: 2px solid var(--color-gold);
    outline-offset: 2px;
}
```

- [x] **Step 5: Verify build passes**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 2: Fix Orthographic Module Bug (`Peaple` -> `People`)

**Files:**
- Rename: `src/pages/Peaple.jsx` -> `src/pages/People.jsx`
- Rename: `src/pages/Peaple.css` -> `src/pages/People.css`
- Modify: `src/pages/People.jsx`
- Modify: `src/App.jsx`

- [x] **Step 1: Move and rename files**

Run:
```bash
mv src/pages/Peaple.jsx src/pages/People.jsx
mv src/pages/Peaple.css src/pages/People.css
```

- [x] **Step 2: Update stylesheet import in `src/pages/People.jsx`**

In `src/pages/People.jsx`, change:
```javascript
import './Peaple.css';
```
to:
```javascript
import './People.css';
```

- [x] **Step 3: Update page import in `src/App.jsx`**

In `src/App.jsx`, change:
```javascript
import { People } from './pages/Peaple';
```
to:
```javascript
import { People } from './pages/People';
```

- [x] **Step 4: Verify build succeeds with new path**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 3: Resolve All 20 ESLint and React 19 Hook Errors

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Works.jsx`
- Modify: `src/pages/People.jsx`
- Modify: `src/pages/Lab.jsx`
- Modify: `src/pages/Booking.jsx`
- Modify: `src/pages/News.jsx`
- Modify: `src/components/common/Navbar.jsx`
- Modify: `src/components/common/Footer.jsx`
- Modify: `src/components/home/HeroMosaic.jsx`
- Modify: `src/components/home/AboutSection.jsx`
- Modify: `src/components/home/RulesSection.jsx`
- Modify: `src/components/home/RecentNewsSection.jsx`
- Modify: `src/components/home/CarouselNavigation.jsx`
- Modify: `src/components/modals/ContactModal.jsx`
- Modify: `src/components/modals/SpotlightSearch.jsx`

- [x] **Step 1: Run linter to view current baseline errors**

Run: `npm run lint`  
Expected output: `✖ 20 problems (19 errors, 1 warning)`

- [x] **Step 2: Remove unnecessary `import React` statements across all files**

In React 19 with the modern JSX Transform, `import React from 'react'` is unused.
- In `src/components/common/Footer.jsx`: change `import React from 'react';` to nothing (only import lucide icons and css).
- In `src/components/home/HeroMosaic.jsx`: remove `import React from 'react';`.
- In `src/components/home/AboutSection.jsx`: remove `import React from 'react';`.
- In `src/components/home/RulesSection.jsx`: remove `import React from 'react';`.
- In `src/pages/Home.jsx`: remove `import React from 'react';`.
- In `src/pages/Lab.jsx`: remove `import React from 'react';`.
- In `src/pages/News.jsx`: remove `import React from 'react';`.
- In `src/pages/Works.jsx`: change `import React, { useState, useMemo } from 'react';` to `import { useState, useMemo } from 'react';`.
- In `src/pages/People.jsx`: change `import React, { useState, useMemo } from 'react';` to `import { useState, useMemo } from 'react';`.
- In `src/components/common/Navbar.jsx`: change `import React, { useState } from 'react';` to `import { useState } from 'react';`.
- In `src/components/home/RecentNewsSection.jsx`: remove `import React from 'react';`.
- In `src/components/home/CarouselNavigation.jsx`: change `import React, { useState, useEffect, useRef } from 'react';` to `import { useState, useEffect, useRef, useCallback } from 'react';`.

- [x] **Step 3: Clean unused imports in `ContactModal.jsx` and `Booking.jsx`**

- In `src/components/modals/ContactModal.jsx`: remove `React` and `Mail` from imports:
```javascript
import { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
```
- In `src/pages/Booking.jsx`: remove `React` and `AlertTriangle` from imports:
```javascript
import { useState } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
```

- [x] **Step 4: Fix `CarouselNavigation.jsx` hook dependency warning**

Wrap `nextSlide` in `useCallback` and include it in the `useEffect` dependencies:
```javascript
const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
}, [total]);

useEffect(() => {
    if (!isPaused) {
        autoPlayRef.current = setInterval(() => {
            nextSlide();
        }, duration);
    }
    return () => clearInterval(autoPlayRef.current);
}, [nextSlide, isPaused]);
```

- [x] **Step 5: Fix `SpotlightSearch.jsx` synchronous `setState` in effect error**

In `src/components/modals/SpotlightSearch.jsx`:
Change the open effect to avoid calling `setQuery('')` and `setActiveCategory('Todos')` synchronously inside an else branch of `useEffect`. Instead, reset state in an explicit `handleClose` or when opening:
```javascript
useEffect(() => {
  if (isOpen) {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }
}, [isOpen]);
```
And in `onClose` callbacks:
```javascript
const handleClose = () => {
  setQuery('');
  setActiveCategory('Todos');
  onClose();
};
```
Use `handleClose` for backdrop clicks, ESC key, clear buttons, and selection.

- [x] **Step 6: Run linter to verify 0 errors**

Run: `npm run lint`  
Expected output: clean run with code 0 (no errors, no warnings).

---

### Task 4: Fallback SVG Thematic Placeholders for Broken Image Links (404)

**Files:**
- Create: `public/placeholders/bancada.svg`
- Create: `public/placeholders/microscopio.svg`
- Create: `public/placeholders/campo.svg`
- Modify: `src/components/home/HeroMosaic.jsx`
- Modify: `src/data/carouselCards.json`
- Modify: `src/data/labFacilities.json`

- [x] **Step 1: Ensure directory `public/placeholders` exists**

Run:
```bash
mkdir -p public/placeholders
```

- [x] **Step 2: Create `public/placeholders/bancada.svg`**

Write `public/placeholders/bancada.svg` with dark green and gold themed lab bench illustration:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBench" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0C120F"/>
      <stop offset="50%" stop-color="#14241B"/>
      <stop offset="100%" stop-color="#1B3125"/>
    </linearGradient>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#165B33"/>
      <stop offset="100%" stop-color="#D6C28F"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgBench)"/>
  <!-- Ambient Grid -->
  <g stroke="rgba(214, 194, 143, 0.08)" stroke-width="1">
    <line x1="0" y1="150" x2="800" y2="150"/>
    <line x1="0" y1="300" x2="800" y2="300"/>
    <line x1="0" y1="450" x2="800" y2="450"/>
    <line x1="200" y1="0" x2="200" y2="600"/>
    <line x1="400" y1="0" x2="400" y2="600"/>
    <line x1="600" y1="0" x2="600" y2="600"/>
  </g>
  <!-- Bench Surface -->
  <rect x="120" y="380" width="560" height="12" rx="4" fill="url(#goldGlow)"/>
  <!-- Glassware and Flasks -->
  <g fill="none" stroke="#D6C28F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- Erlenmeyer 1 -->
    <path d="M 260 270 L 280 270 L 280 300 L 320 370 L 220 370 L 260 300 Z" stroke="#4EA86E"/>
    <line x1="240" y1="340" x2="300" y2="340" stroke="#4EA86E" stroke-dasharray="4,4"/>
    <!-- Test Tubes Rack -->
    <rect x="360" y="300" width="100" height="70" rx="3" stroke="#D6C28F" fill="rgba(20, 36, 27, 0.6)"/>
    <line x1="380" y1="280" x2="380" y2="350"/>
    <line x1="410" y1="270" x2="410" y2="350"/>
    <line x1="440" y1="285" x2="440" y2="350"/>
    <!-- Petry Dish -->
    <ellipse cx="540" cy="365" rx="50" ry="12" fill="rgba(78, 168, 110, 0.15)" stroke="#4EA86E"/>
  </g>
  <text x="400" y="470" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#F4F7F4" text-anchor="middle" letter-spacing="3">ATIVIDADE EM BANCADA</text>
  <text x="400" y="505" font-family="system-ui, sans-serif" font-size="14" fill="#A0B0A4" text-anchor="middle" letter-spacing="1">PREPARAÇÃO & TRIAGEM DE AMOSTRAS FITOPLANCTÔNICAS</text>
</svg>
```

- [x] **Step 3: Create `public/placeholders/microscopio.svg`**

Write `public/placeholders/microscopio.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgMicro" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0C120F"/>
      <stop offset="50%" stop-color="#14241B"/>
      <stop offset="100%" stop-color="#165B33"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgMicro)"/>
  <!-- Focus Rings Target -->
  <g stroke="rgba(214, 194, 143, 0.2)" stroke-width="2" fill="none">
    <circle cx="400" cy="270" r="160" stroke-dasharray="6,6"/>
    <circle cx="400" cy="270" r="110"/>
    <circle cx="400" cy="270" r="60"/>
  </g>
  <!-- Microscope Outline -->
  <g fill="none" stroke="#D6C28F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <!-- Eyepiece Tube -->
    <line x1="370" y1="130" x2="410" y2="180"/>
    <rect x="350" y="105" width="30" height="30" rx="3" transform="rotate(-38 350 105)"/>
    <!-- Revolver & Objectives -->
    <circle cx="415" cy="210" r="18" fill="rgba(22, 91, 51, 0.5)"/>
    <line x1="410" y1="228" x2="400" y2="260"/>
    <line x1="425" y1="225" x2="435" y2="255"/>
    <!-- Stage -->
    <line x1="330" y1="285" x2="470" y2="285" stroke-width="6"/>
    <!-- Arm Curved -->
    <path d="M 425 180 C 490 200, 500 320, 440 370 L 440 400"/>
    <!-- Base -->
    <path d="M 320 420 L 480 420" stroke-width="8"/>
  </g>
  <text x="400" y="475" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#F4F7F4" text-anchor="middle" letter-spacing="3">MICROSCOPIA & ANÁLISE</text>
  <text x="400" y="510" font-family="system-ui, sans-serif" font-size="14" fill="#A0B0A4" text-anchor="middle" letter-spacing="1">TAXONOMIA & CONTAGEM DE FRÚSTULAS DE DIATOMÁCEAS</text>
</svg>
```

- [x] **Step 4: Create `public/placeholders/campo.svg`**

Write `public/placeholders/campo.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgField" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0C120F"/>
      <stop offset="50%" stop-color="#14241B"/>
      <stop offset="100%" stop-color="#165B33"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgField)"/>
  <!-- River Waves and Sun Rays -->
  <g fill="none" stroke="rgba(214, 194, 143, 0.15)" stroke-width="2">
    <path d="M 0 340 Q 200 310, 400 340 T 800 340"/>
    <path d="M 0 380 Q 200 350, 400 380 T 800 380"/>
    <path d="M 0 420 Q 200 390, 400 420 T 800 420"/>
  </g>
  <!-- Field Boat & Plankton Net -->
  <g fill="none" stroke="#D6C28F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- Small Boat Profile -->
    <path d="M 280 340 L 520 340 C 490 380, 310 380, 280 340 Z" fill="rgba(22, 91, 51, 0.4)"/>
    <line x1="420" y1="280" x2="420" y2="340"/>
    <!-- Plankton Cone Net -->
    <path d="M 500 350 L 560 370 L 550 395 L 490 365 Z" stroke="#4EA86E"/>
    <circle cx="560" cy="385" r="8" fill="#4EA86E"/>
    <!-- Sun Horizon -->
    <circle cx="400" cy="220" r="50" stroke="#D6C28F" stroke-width="2" stroke-dasharray="5,5"/>
  </g>
  <text x="400" y="475" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#F4F7F4" text-anchor="middle" letter-spacing="3">COLETA EM CAMPO</text>
  <text x="400" y="510" font-family="system-ui, sans-serif" font-size="14" fill="#A0B0A4" text-anchor="middle" letter-spacing="1">EXPEDIÇÕES LIMNOLÓGICAS NAS BACIAS DO TAPAJÓS</text>
</svg>
```

- [x] **Step 5: Update image file paths in `HeroMosaic.jsx`, `carouselCards.json`, and `labFacilities.json`**

- In `src/components/home/HeroMosaic.jsx`:
  - Change `/placeholders/bancada.jpg` -> `/placeholders/bancada.svg`
  - Change `/placeholders/microscopio.jpg` -> `/placeholders/microscopio.svg`
  - Change `/placeholders/campo.jpg` -> `/placeholders/campo.svg`
- In `src/data/carouselCards.json`: update references to `.svg`.
- In `src/data/labFacilities.json`: update references to `.svg`.

- [x] **Step 6: Verify assets load with 200 OK**

Run: `ls -lh public/placeholders/`  
Expected output: 3 svg files listed.

---

### Task 5: Design System Tokens, Focus Ring & Typography Refactoring

**Files:**
- Modify: `src/styles/theme.css`
- Modify: `src/components/home/AboutSection.css`

- [x] **Step 1: Expand `src/styles/theme.css` with 3-tier token architecture**

Replace `src/styles/theme.css` with:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
    /* 1. Primitivos da Paleta Amazônica */
    --color-green-950: #0C120F; /* Grafite Amazônico profundo */
    --color-green-900: #14241B; /* Superfície base */
    --color-green-850: #1B3125; /* Superfície elevada */
    --color-green-700: #165B33; /* Verde Institucional UFOPA */
    --color-green-500: #4EA86E; /* Verde Clorofila / Interação */
    --color-gold-400:  #D6C28F; /* Dourado / Areia Aluvial */
    --color-gold-300:  #E8DEC0;
    --color-gold-100:  #FAF7EE;
    --color-light-100: #F4F7F4; /* Texto principal de alto contraste */
    --color-muted-400: #A0B0A4; /* Texto secundário com contraste AA */
    --color-danger-500: #EF4444;

    /* 2. Tokens Semânticos */
    --bg-primary: var(--color-green-950);
    --bg-surface: var(--color-green-900);
    --bg-surface-elevated: var(--color-green-850);
    --color-brand: var(--color-green-700);
    --color-gold: var(--color-gold-400);
    --color-accent: var(--color-green-500);

    --text-main: var(--color-light-100);
    --text-muted: var(--color-muted-400);
    --border-subtle: rgba(214, 194, 143, 0.2);
    --border-gold: rgba(214, 194, 143, 0.45);
    --border-accent: rgba(78, 168, 110, 0.35);

    /* 3. Escala de Espaçamento e Raios */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-6: 24px;
    --space-8: 32px;
    --space-12: 48px;

    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 14px;
    --radius-full: 9999px;

    --transition-fast: 0.18s ease-in-out;
    --transition-normal: 0.28s ease-in-out;

    /* Acessibilidade: Anel de Foco Visível (WCAG 2.2 AAA/AA) */
    --focus-ring: 0 0 0 2px var(--color-green-950), 0 0 0 4px var(--color-gold-400);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--bg-primary);
    color: var(--text-main);
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

/* Foco Global Visível para Navegação por Teclado */
:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
}

a {
    color: inherit;
    text-decoration: none;
}

button {
    font: inherit;
    cursor: pointer;
    border: none;
    background: none;
}

/* Link de salto de navegação acessível */
.skip-link {
    position: absolute;
    top: -100px;
    left: 1rem;
    background-color: var(--color-brand);
    color: var(--text-main);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    border: 2px solid var(--color-gold);
    z-index: 9999;
    font-weight: 600;
    text-decoration: none;
    transition: top var(--transition-fast);
}

.skip-link:focus-visible {
    top: 1rem;
}

/* Respeito às preferências de movimento reduzido (WCAG 2.2) */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

- [x] **Step 2: Remove `text-align: justify` from `AboutSection.css`**

In `src/components/home/AboutSection.css`, replace:
```css
.about-text {
    text-align: justify;
    text-justify: inter-word;
}
```
with:
```css
.about-text {
    text-align: left;
    max-width: 72ch;
    margin: 0 auto;
    text-wrap: pretty;
}
```

- [x] **Step 3: Verify build succeeds**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 6: Modernize Navbar & Accessible Non-Shifting Mobile Drawer

**Files:**
- Modify: `src/components/common/Navbar.jsx`
- Modify: `src/components/common/Navbar.css`

- [x] **Step 1: Refactor `Navbar.jsx` with OS shortcut detection, backdrop and body lock**

Replace `src/components/common/Navbar.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Users } from 'lucide-react';
import './Navbar.css';

export function Navbar({ onOpenSearch, onOpenContact }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl+K');

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent.includes('Mac')) {
      setShortcutLabel('⌘K');
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeMobileMenu();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="navbar-header" role="banner">
      <div className="navbar-container">

        {/* 1. Botão Hambúrguer Mobile */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        {/* 2. Logo e Marca */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu} aria-label="Página inicial do LABETA">
          <div className="brand-logo-frame">
            <img
              src="/logo-labeta.svg"
              alt="Logotipo Oficial LABETA"
              className="brand-logo-img"
              width="40"
              height="40"
            />
          </div>
          <div className="brand-titles">
            <span className="brand-name">LABETA</span>
            <span className="brand-tagline">Algas da Amazônia</span>
          </div>
        </Link>

        {/* 3. Navegação Desktop */}
        <nav className="navbar-nav desktop-nav" aria-label="Navegação Principal Desktop">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/trabalhos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Trabalhos
              </NavLink>
            </li>
            <li>
              <NavLink to="/pessoas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Pessoas
              </NavLink>
            </li>
            <li>
              <NavLink to="/laboratorio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Laboratório
              </NavLink>
            </li>
            <li>
              <NavLink to="/noticias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Notícias
              </NavLink>
            </li>
            <li>
              <NavLink to="/agendamento" className={({ isActive }) => isActive ? 'nav-link nav-link-highlight active' : 'nav-link nav-link-highlight'}>
                Agendamento
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 4. Ações Rápidas */}
        <div className="navbar-actions">
          <button
            type="button"
            className="action-btn search-trigger"
            onClick={onOpenSearch}
            aria-label={`Abrir pesquisa rápida (${shortcutLabel})`}
            title={`Pesquisar (${shortcutLabel})`}
          >
            <Search size={16} aria-hidden="true" />
            <span className="search-shortcut">{shortcutLabel}</span>
          </button>

          <button
            type="button"
            className="action-btn contact-trigger"
            onClick={onOpenContact}
            aria-label="Ver contatos rápidos da equipe"
            title="Contatos"
          >
            <Users size={16} className="contact-icon" aria-hidden="true" />
            <span className="contact-text">Contatos</span>
          </button>
        </div>

      </div>

      {/* 5. Backdrop do Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* 6. Gaveta Mobile Suspensa Acessível */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu de Navegação Mobile"
      >
        <ul className="mobile-nav-list">
          <li>
            <NavLink to="/" end className="mobile-nav-link" onClick={closeMobileMenu}>
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/trabalhos" className="mobile-nav-link" onClick={closeMobileMenu}>
              Trabalhos
            </NavLink>
          </li>
          <li>
            <NavLink to="/pessoas" className="mobile-nav-link" onClick={closeMobileMenu}>
              Pessoas
            </NavLink>
          </li>
          <li>
            <NavLink to="/laboratorio" className="mobile-nav-link" onClick={closeMobileMenu}>
              Laboratório
            </NavLink>
          </li>
          <li>
            <NavLink to="/noticias" className="mobile-nav-link" onClick={closeMobileMenu}>
              Notícias
            </NavLink>
          </li>
          <li>
            <NavLink to="/agendamento" className="mobile-nav-link mobile-highlight" onClick={closeMobileMenu}>
              Agendamento
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

- [x] **Step 2: Update `Navbar.css` to handle backdrop and overlay without layout shift**

Add backdrop styling and absolute positioning for mobile drawer in `src/components/common/Navbar.css`:
```css
/* Backdrop para fechar o menu ao clicar fora */
.mobile-nav-backdrop {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 95;
}

@media (max-width: 900px) {
    .mobile-nav-drawer {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        display: block;
        max-height: 0;
        overflow: hidden;
        background-color: var(--bg-surface);
        border-bottom: 1px solid transparent;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
        transition: max-height 0.28s ease, border-color 0.28s ease;
        z-index: 100;
    }

    .mobile-nav-drawer.open {
        max-height: 380px;
        border-color: var(--border-gold);
    }
}
```

- [x] **Step 3: Verify build succeeds**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 7: Rebuild Spotlight Search (`Ctrl+K`) with Multi-Dataset Index & Keyboard Navigation

**Files:**
- Modify: `src/components/modals/SpotlightSearch.jsx`
- Modify: `src/components/modals/SpotlightSearch.css`

- [x] **Step 1: Update `SpotlightSearch.jsx` to load all real data and support keyboard selection**

Replace `src/components/modals/SpotlightSearch.jsx`:
```jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Users, ShieldAlert, Newspaper, ArrowRight, Microscope } from 'lucide-react';
import membersData from '../../data/members.json';
import worksData from '../../data/works.json';
import newsData from '../../data/news.json';
import equipmentData from '../../data/equipment.json';
import './SpotlightSearch.css';

const categories = ['Todos', 'Membros', 'Trabalhos', 'Equipamentos', 'Biossegurança', 'Notícias'];

export function SpotlightSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);
  const navigate = useNavigate();

  // Consolidação dinâmica do acervo completo
  const searchableBase = useMemo(() => {
    const list = [];

    // 1. Membros
    membersData.forEach((m) => {
      list.push({
        id: `member-${m.id}`,
        category: 'Membros',
        title: m.name,
        subtitle: `${m.role} • ${m.researchArea}`,
        link: '/pessoas'
      });
    });

    // 2. Trabalhos Científicos
    worksData.forEach((w) => {
      list.push({
        id: `work-${w.id}`,
        category: 'Trabalhos',
        title: w.title,
        subtitle: `${w.authors} (${w.year}) • ${w.category}`,
        link: '/trabalhos'
      });
    });

    // 3. Equipamentos Analíticos
    equipmentData.forEach((eq) => {
      list.push({
        id: `eq-${eq.id}`,
        category: 'Equipamentos',
        title: eq.name,
        subtitle: `${eq.code} • ${eq.capacity}`,
        link: '/agendamento'
      });
    });

    // 4. Notícias e Radar
    newsData.announcements.forEach((a) => {
      list.push({
        id: `news-${a.id}`,
        category: 'Notícias',
        title: a.title,
        subtitle: `${a.date} • ${a.content}`,
        link: '/noticias'
      });
    });
    newsData.scientificRadar.forEach((r) => {
      list.push({
        id: `radar-${r.id}`,
        category: 'Notícias',
        title: r.title,
        subtitle: `${r.journal} (${r.year}) • ${r.summary}`,
        link: '/noticias'
      });
    });

    // 5. Biossegurança
    list.push({
      id: 'rule-1',
      category: 'Biossegurança',
      title: 'EPIs Mandatórios em Processos de Oxidação',
      subtitle: 'Jaleco longo, calça, máscara, luvas nitrílicas e calçado 100% fechado.',
      link: '/#rules-title'
    });
    list.push({
      id: 'rule-2',
      category: 'Biossegurança',
      title: 'Higienização Mandatória de Vidrarias e Lâminas',
      subtitle: 'Descontaminação imediata pós-uso para evitar contaminação cruzada.',
      link: '/#rules-title'
    });

    return list;
  }, []);

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    setActiveCategory('Todos');
    setSelectedIndex(0);
    onClose();
  };

  // Fechamento com Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtro em tempo real
  const filteredResults = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return searchableBase.filter((item) => {
      const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchText = normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchText;
    });
  }, [searchableBase, query, activeCategory]);

  // Reset do índice ao trocar filtro
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const handleSelect = (link) => {
    handleClose();
    navigate(link);
  };

  // Navegação por teclado (ArrowUp, ArrowDown, Enter)
  const handleInputKeyDown = (e) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].link);
      }
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Membros': return <Users size={14} aria-hidden="true" />;
      case 'Trabalhos': return <BookOpen size={14} aria-hidden="true" />;
      case 'Equipamentos': return <Microscope size={14} aria-hidden="true" />;
      case 'Biossegurança': return <ShieldAlert size={14} aria-hidden="true" />;
      case 'Notícias': return <Newspaper size={14} aria-hidden="true" />;
      default: return <Search size={14} aria-hidden="true" />;
    }
  };

  return (
    <div className="spotlight-overlay" onClick={handleClose} role="presentation">
      <aside
        className="spotlight-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Busca Global no Portal LABETA"
      >
        <div className="spotlight-search-header">
          <Search size={20} className="search-icon" aria-hidden="true" />

          <input
            ref={inputRef}
            type="search"
            className="spotlight-input"
            placeholder="Pesquisar por diatomáceas, membros, artigos ou equipamentos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-autocomplete="list"
            aria-controls="spotlight-results-list"
          />

          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setQuery('')}
              aria-label="Limpar texto da pesquisa"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="esc-close-btn"
            onClick={handleClose}
            title="Fechar busca (Esc)"
            aria-label="Fechar busca rápida"
          >
            <span className="esc-text">ESC</span>
            <X size={16} className="esc-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Pílulas de Categoria */}
        <nav className="pills-nav" aria-label="Filtrar por categoria">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Resultados Acessíveis */}
        <div className="spotlight-results" role="region" aria-live="polite">
          {filteredResults.length > 0 ? (
            <ul
              id="spotlight-results-list"
              className="results-list"
              ref={resultsListRef}
              role="listbox"
            >
              {filteredResults.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`result-item ${selectedIndex === index ? 'active-keyboard' : ''}`}
                  onClick={() => handleSelect(item.link)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-info">
                    <div className="result-header">
                      <span className={`category-badge badge-${item.category.toLowerCase()}`}>
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      <h4 className="result-title">{item.title}</h4>
                    </div>
                    <p className="result-subtitle">{item.subtitle}</p>
                  </div>
                  <ArrowRight size={16} className="result-arrow" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results-box">
              <p>Nenhum resultado encontrado para <strong>"{query}"</strong></p>
              <span className="no-results-hint">Tente buscar por termos como "diatomáceas", "microscópio", "EPIs" ou pelo nome de um membro.</span>
            </div>
          )}
        </div>

        {/* Rodapé com Dicas de Teclado */}
        <footer className="spotlight-footer">
          <span>Navegar: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Selecionar: <kbd>Enter</kbd></span>
          <span>Fechar: <kbd>Esc</kbd></span>
        </footer>
      </aside>
    </div>
  );
}
```

- [x] **Step 2: Add keyboard selection and footer styling in `SpotlightSearch.css`**

Add to `src/components/modals/SpotlightSearch.css`:
```css
.result-item.active-keyboard {
    background-color: var(--bg-surface-elevated);
    border-left: 3px solid var(--color-gold);
}

.result-item.active-keyboard .result-arrow {
    opacity: 1;
    color: var(--color-gold);
    transform: translateX(3px);
}

.badge-equipamentos {
    color: #4EA86E;
    background-color: rgba(78, 168, 110, 0.12);
    border: 1px solid rgba(78, 168, 110, 0.3);
}

.spotlight-footer {
    padding: 0.6rem 1.25rem;
    background-color: var(--bg-primary);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.spotlight-footer kbd {
    background-color: var(--bg-surface-elevated);
    border: 1px solid var(--border-gold);
    color: var(--color-gold);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 0.7rem;
    margin-left: 2px;
}
```

- [x] **Step 3: Run linter and build check**

Run: `npm run lint && npm run build`  
Expected output: 0 errors.

---

### Task 8: Accessible Carousel with Touch Swipe and Pause/Play Control (WCAG 2.2.2)

**Files:**
- Modify: `src/components/home/CarouselNavigation.jsx`
- Modify: `src/components/home/CarouselNavigation.css`

- [x] **Step 1: Update `CarouselNavigation.jsx` with touch swipe and accessible pause button**

Replace `src/components/home/CarouselNavigation.jsx`:
```jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import cardsData from '../../data/carouselCards.json';
import './CarouselNavigation.css';

export function CarouselNavigation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const autoPlayRef = useRef(null);
    const duration = 5000;
    const total = cardsData.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Respeita prefers-reduced-motion
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setIsPaused(true);
        }
    }, []);

    useEffect(() => {
        if (!isPaused) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, duration);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isPaused]);

    // Suporte a gestos touch (Mobile Swipe)
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (diffX > 50) {
            nextSlide(); // Deslizar para a esquerda avança
        } else if (diffX < -50) {
            prevSlide(); // Deslizar para a direita volta
        }
        setTouchStartX(null);
    };

    const visibleCards = [
        cardsData[currentIndex % total],
        cardsData[(currentIndex + 1) % total],
        cardsData[(currentIndex + 2) % total]
    ];

    return (
        <section
            className="carousel-section"
            aria-roledescription="carousel"
            aria-label="Exploração Rápida do LABETA"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="carousel-container">

                <div className="carousel-top-bar">
                    <span className="carousel-section-tag">Navegação Rápida</span>
                    <button
                        type="button"
                        className="carousel-pause-btn"
                        onClick={() => setIsPaused((prev) => !prev)}
                        aria-label={isPaused ? "Retomar rotação automática do carrossel" : "Pausar rotação automática do carrossel"}
                    >
                        {isPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                        <span>{isPaused ? "Retomar" : "Pausar"}</span>
                    </button>
                </div>

                <div className="carousel-stage">
                    <button
                        type="button"
                        className="carousel-btn btn-prev"
                        onClick={prevSlide}
                        aria-label="Ver slide anterior"
                    >
                        <ChevronLeft size={28} aria-hidden="true" />
                    </button>

                    <div className="carousel-cards-grid">
                        {visibleCards.map((card, index) => (
                            <article className="carousel-card-item" key={`${card.id}-${index}`}>
                                <div className="card-thumb-frame">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="card-thumb-img"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="card-body">
                                    <span className="card-tag">{card.tag}</span>
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>

                                    <Link to={card.link} className="card-cta-btn">
                                        <span>{card.ctaText}</span>
                                        <ArrowRight size={15} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="carousel-btn btn-next"
                        onClick={nextSlide}
                        aria-label="Ver próximo slide"
                    >
                        <ChevronRight size={28} aria-hidden="true" />
                    </button>
                </div>

                {/* Linha de Progresso Visual */}
                <div className="carousel-progress-track" aria-hidden="true">
                    <div
                        className={`carousel-progress-bar ${isPaused ? 'paused' : ''}`}
                        key={currentIndex}
                    />
                </div>

            </div>
        </section>
    );
}
```

- [x] **Step 2: Clean up duplicated classes and mobile controls in `CarouselNavigation.css`**

Add `.carousel-top-bar` and ensure buttons are accessible in mobile without vanishing completely:
```css
.carousel-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.carousel-section-tag {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-gold);
    font-weight: 700;
}

.carousel-pause-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    background-color: var(--bg-surface-elevated);
    border: 1px solid var(--border-subtle);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.carousel-pause-btn:hover {
    color: var(--color-gold);
    border-color: var(--color-gold);
}

@media (max-width: 768px) {
    .carousel-btn {
        width: 38px;
        height: 38px;
    }
}
```

- [x] **Step 3: Verify build succeeds**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 9: SPA Routing Repair & Official Campus Address Unification

**Files:**
- Modify: `src/pages/Lab.jsx`
- Modify: `src/components/common/Footer.jsx`
- Modify: `src/components/home/HeroMosaic.css`

- [x] **Step 1: Replace raw `<a href="/agendamento">` with React Router `<Link>` in `src/pages/Lab.jsx`**

In `src/pages/Lab.jsx`:
Import `Link` from `react-router-dom`:
```javascript
import { Link } from 'react-router-dom';
```
And replace line 94:
```jsx
<Link to="/agendamento" className="cta-box-link">
    <span>Ver Disponibilidade & Agendar</span>
    <ArrowRight size={16} />
</Link>
```

- [x] **Step 2: Unify physical laboratory address across `Lab.jsx` and `Footer.jsx`**

Official unified address: **UFOPA – Campus Tapajós, Bloco 1, Sala 5 — Santarém, Pará**.
- In `src/components/common/Footer.jsx`: change:
```jsx
<span>UFOPA – Unidade Tapajós, Bloco 09, sala 06 — Santarém, PA</span>
```
to:
```jsx
<span>UFOPA – Campus Tapajós, Bloco 1, Sala 5 — Santarém, Pará</span>
```

- [x] **Step 3: Fix `hero-logo-svg` size constraint in `HeroMosaic.css`**

In `src/components/home/HeroMosaic.css`:
Replace:
```css
.hero-logo-svg {
    width: 30vh;
    height: 30vh;
    object-fit: contain;
}
```
with:
```css
.hero-logo-svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
```

- [x] **Step 4: Verify build succeeds**

Run: `npm run build`  
Expected output: `✓ built in ...`

---

### Task 10: Internal Pages Optimization (Works, People, Modals & About)

**Files:**
- Modify: `src/pages/Works.jsx`
- Modify: `src/pages/People.jsx`
- Modify: `src/components/modals/ContactModal.jsx`
- Modify: `src/components/home/AboutSection.jsx`
- Modify: `src/components/home/RulesSection.jsx`

- [x] **Step 1: Add live text search query filter in `src/pages/Works.jsx`**

In `src/pages/Works.jsx`, add a search input allowing users to filter by title, author, or tag:
```jsx
const [searchQuery, setSearchQuery] = useState('');

const filteredWorks = useMemo(() => {
    return worksData.filter((item) => {
        const matchesStatus = filter === 'todos' || item.status === filter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = q === '' ||
            item.title.toLowerCase().includes(q) ||
            item.authors.toLowerCase().includes(q) ||
            item.tags.some(t => t.toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
    });
}, [filter, searchQuery]);
```

- [x] **Step 2: Guard against placeholder Lattes URLs in `src/pages/People.jsx`**

In `src/pages/People.jsx`, verify that `member.lattes` is valid before rendering an active link:
```jsx
{member.lattes && !member.lattes.includes('0000000000000000') ? (
    <a
        href={member.lattes}
        target="_blank"
        rel="noopener noreferrer"
        className="person-lattes-link"
        title={`Currículo Lattes de ${member.name} (abre em nova aba)`}
        aria-label={`Currículo Lattes de ${member.name} (abre em nova aba)`}
    >
        <span>Currículo Lattes</span>
        <ExternalLink size={13} aria-hidden="true" />
    </a>
) : (
    <span className="person-lattes-link disabled" title="Currículo Lattes em atualização">
        <span>Lattes em atualização</span>
    </span>
)}
```

- [x] **Step 3: Add accessible `aria-live` announcement and copy feedback in `ContactModal.jsx`**

In `src/components/modals/ContactModal.jsx`, add an alert region for screen readers:
```jsx
<div className="sr-only" aria-live="polite">
    {copiedId ? "E-mail copiado com sucesso para a área de transferência." : ""}
</div>
```

- [x] **Step 4: Remove duplicated sentence in `AboutSection.jsx`**

In `src/components/home/AboutSection.jsx`, remove the duplicate paragraph and present a unified statement:
```jsx
<div className="about-content">
    <p className="about-lead">
        O <strong>Laboratório de Ecologia e Taxonomia de Algas (LABETA)</strong> da Universidade Federal do Oeste do Pará é um centro de excelência dedicado à investigação da biodiversidade ficológica e dos processos funcionais em ecossistemas aquáticos amazônicos.
    </p>
    <p className="about-text">
        Integrando taxonomia clássica e ecologia aplicada, o laboratório atua na vanguarda do monitoramento ambiental, utilizando as microalgas como bioindicadores essenciais da qualidade da água na bacia do Rio Tapajós e no Baixo Amazonas.
    </p>
    <p className="about-text">
        Nossa infraestrutura alia rigor científico, inovação e ensino, promovendo a formação de pesquisadores e fornecendo dados estratégicos para a conservação e gestão sustentável dos recursos hídricos na Amazônia.
    </p>
</div>
```

- [x] **Step 5: Adjust `RulesSection.jsx` progressive disclosure**

In `src/components/home/RulesSection.jsx`:
Keep only Rule 1 with `<details className="rule-card" open>` and Rules 2 & 3 with `<details className="rule-card">` (initially closed) to reduce vertical clutter while remaining interactive.

- [x] **Step 6: Run final full test suite and build verification**

Run:
```bash
npm run lint && npm run build
```
Expected output:
- `eslint .` exits with code 0 (zero errors, zero warnings).
- `vite build` completes successfully and produces optimized client assets.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-09-ui-ux-modernization-labeta.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
