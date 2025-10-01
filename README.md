<div align="center">
  <img src="./public/logo-yol.svg" alt="YOL Project Logo" width="150" height="150" />

  <h1 align="center">
    YOL-BENICIO
  </h1>

  <p align="center">
    A modern platform for legal services management
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/license/gabrielmaialva33/yol-benicio?color=00b8d3&style=for-the-badge&logo=appveyor" alt="License" />
    <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/yol-benicio?style=for-the-badge&logo=typescript" alt="GitHub top language" >
    <img src="https://img.shields.io/github/languages/count/gabrielmaialva33/yol-benicio?style=for-the-badge&logo=appveyor" alt="GitHub language count" >
    <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/yol-benicio?style=for-the-badge&logo=appveyor" alt="Repository size" >
  </p>

  <p align="center">
    <a href="https://github.com/gabrielmaialva33/yol-benicio/commits/main">
      <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/yol-benicio?style=for-the-badge&logo=git" alt="GitHub last commit" >
      <img src="https://img.shields.io/badge/made%20by-Maia-15c3d6?style=for-the-badge&logo=dev.to" alt="Maia" >  
    </a>
  </p>

  <p align="center">
    <a href="#about">About</a> •
    <a href="#technologies">Technologies</a> •
    <a href="#installation">Installation</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## 📖 About

**YOL-BENICIO** is a web application for Benício Advogados, designed to provide a modern and efficient platform for
legal services management.

## 💻 Technologies

<table align="center">
  <tr>
    <td align="center" width="96">
      <a href="https://vitejs.dev/">
        <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
      </a>
      <br>Vite
    </td>
    <td align="center" width="96">
      <a href="https://reactjs.org/">
        <img src="https://reactjs.org/favicon.ico" width="48" height="48" alt="React" />
      </a>
      <br>React
    </td>
    <td align="center" width="96">
      <a href="https://www.typescriptlang.org/">
        <img src="https://www.typescriptlang.org/favicon-32x32.png" width="48" height="48" alt="TypeScript" />
      </a>
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <a href="https://tailwindcss.com/">
        <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="48" height="48" alt="Tailwind" />
      </a>
      <br>Tailwind
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <a href="https://vitest.dev/">
        <img src="https://vitest.dev/favicon.ico" width="48" height="48" alt="Vitest" />
      </a>
      <br>Vitest
    </td>
    <td align="center" width="96">
      <a href="https://testing-library.com/">
        <img src="https://testing-library.com/img/octopus-64x64.png" width="48" height="48" alt="Testing Library" />
      </a>
      <br>Testing Library
    </td>
    <td align="center" width="96">
      <a href="https://playwright.dev/">
        <img src="https://playwright.dev/img/playwright-logo.svg" width="48" height="48" alt="Playwright" />
      </a>
      <br>Playwright
    </td>
    <td align="center" width="96">
      <a href="https://biomejs.dev/">
        <img src="https://biomejs.dev/img/favicon.svg" width="48" height="48" alt="Biome" />
      </a>
      <br>Biome
    </td>
  </tr>
</table>

---

## 📦 Installation

### Prerequisites

The following software must be installed:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/)

### Cloning the repository

```bash
$ git clone https://github.com/gabrielmaialva33/yol-benicio.git
```

### Running the application

```bash
$ cd yol-benicio
# Install dependencies
$ pnpm install
# Start the development server
$ pnpm dev
```

---

## 🧭 Exploração do Projeto

Esta seção traz uma visão prática e rápida de como o projeto está organizado, como executar, testar e contribuir no dia
a dia.

### Visão Geral

- Build tool: Vite 7 (React + TypeScript)
- UI: React 19, Tailwind CSS 4
- Dados e Estado: TanStack Query 5
- Roteamento: React Router 7
- Mocks de API: MSW 2 (Mock Service Worker)
- Testes: Vitest + Testing Library (unitários) e Playwright (E2E)
- Lint/Format: Biome + checagem de tipos (tsc)

### Scripts úteis

```bash
# Desenvolvimento (abre o navegador automaticamente)
pnpm dev

# Testes unitários
pnpm test         # modo watch
pnpm test:ci      # execução headless e coleta de cobertura

# Testes E2E (Playwright)
pnpm test:e2e         # UI do Playwright
pnpm test:e2e:headed  # browser visível
pnpm test:e2e:debug   # modo debug
pnpm test:e2e:ci      # headless para CI

# Qualidade de código
pnpm lint         # tsc + biome
pnpm lint:tsc     # checagem de tipos
pnpm lint:biome   # lint/format com Biome

# Build e Preview
pnpm build
pnpm preview

# Pipeline local completo (lint + unit + e2e)
pnpm validate
```

### Estrutura principal de pastas

```
/ (raiz)
├─ index.html
├─ vite.config.ts               # base '/yol-benicio/' (GH Pages), testes Vitest
├─ playwright.config.ts         # E2E: webServer pnpm dev, baseURL http://localhost:5173
├─ tsconfig*.json               # baseUrl: 'src' (imports absolutos), vite-tsconfig-paths
├─ public/
│  └─ logo-yol.svg, mock-service-worker.js (gerado pelo MSW)
├─ src/
│  ├─ app/
│  │  └─ router.tsx            # definição de rotas (lazy)
│  ├─ features/
│  │  ├─ auth/                 # LoginPage e formulário
│  │  ├─ dashboard/            # Layout (Header, Sidebar) + widgets
│  │  └─ folders/              # Consulta, detalhe e cadastro de pastas
│  ├─ mocks/
│  │  ├─ browser.ts            # setupWorker(...handlers)
│  │  ├─ handlers.ts           # composição de handlers
│  │  └─ handlers/             # handlers por domínio (auth, dashboard, folders...)
│  ├─ shared/
│  │  ├─ api/                  # auth e utilitários de API
│  │  ├─ hooks/                # createApiHooks (CRUD genérico), etc.
│  │  ├─ types/                # tipos de API e domínio
│  │  ├─ ui/                   # componentes compartilhados
│  │  └─ utils/                # helpers (datas, avatar, media query...)
│  ├─ test-setup.ts            # Vitest + MSW (server.listen/reset/close)
│  ├─ test-utils.tsx           # render util com QueryClientProvider + BrowserRouter
│  ├─ App.tsx                  # orquestra o AppRouter
│  └─ main.tsx                 # ponto de entrada (QueryClient, Router, MSW)
└─ tests/                      # specs E2E (Playwright)
```

### Roteamento

Definido em src/app/router.tsx com carregamento lazy:

- '/' → LoginPage
- '/dashboard' → layout do Dashboard (Header + Sidebar)
    - index → DashboardContent
    - 'folders/consultation' → consulta de pastas
    - 'folders/consultation/:folderId' → detalhes de uma pasta
    - 'folders/register' → cadastro de pastas
- '*' → redireciona para '/'

Observação: Por estar publicado no GitHub Pages, o projeto usa basename/base '/yol-benicio/':

- vite.config.ts → base: '/yol-benicio/'
- src/main.tsx → <BrowserRouter basename='/yol-benicio/'>
  Em desenvolvimento, o servidor roda em http://localhost:5173; se notar URLs com prefixo,
  acesse http://localhost:5173/yol-benicio/.

### MSW (Mock Service Worker)

- Inicialização em desenvolvimento e quando hospedado no GitHub Pages:
    - src/main.tsx inicia o worker quando import.meta.env.DEV ou hostname inclui 'github.io'.
    - O service worker é servido em '/yol-benicio/mock-service-worker.js'.
- Antes do build, o worker é gerado em public/ via script prebuild: `npx msw init public/`.
- Nos testes unitários (Vitest), o MSW roda em modo server (src/test-setup.ts via src/mocks/server.ts).

### API e Hooks

- O módulo src/shared/hooks/use-api.ts expõe createApiHooks para CRUD genérico (useList, useGet, useCreate, useUpdate,
  useDelete) com TanStack Query.
- Base de URL e headers são montados dinamicamente; em mocks, as rotas são atendidas pelos handlers do MSW.

### Convenções

- Imports absolutos (graças ao baseUrl 'src' e vite-tsconfig-paths).
- TypeScript em modo estrito, Jest-DOM para assertions em testes, happy-dom como ambiente.
- Tailwind 4 com plugin oficial @tailwindcss/vite e Autoprefixer.

---

## 📝 License

This project is under the **MIT** license.

[View License](./LICENSE)

---

<div align="center">
  Made with ❤️ by

  <a href="https://github.com/gabrielmaialva33/" target="_blank">
    <img src="https://github.com/gabrielmaialva33.png" alt="Maia" width="60" height="60" style="border-radius: 50%">
    <p>Gabriel Maia</p>
  </a>

&copy; 2017-present <a href="https://github.com/gabrielmaialva33/" target="_blank">Maia</a>

  <p>
    <a href="https://github.com/gabrielmaialva33/yol-benicio" target="_blank">GitHub</a> |
    <a href="https://gabrielmaialva33.github.io/yol-benicio/" target="_blank">Live Demo</a>
  </p>
</div>
