# PulseFlow — Business Suite

SaaS premium de gestão financeira e operacional construído com React + TypeScript.

## Stack

- React 18 + TypeScript 5 · Vite 5
- TailwindCSS 3 · Framer Motion
- React Three Fiber (Three.js) — elementos 3D
- React Query v5 · Zustand · Axios
- Recharts · TradingView Lightweight Charts

## Pré-requisitos

- Node.js 18+
- Java 11+ (para o backend de agendamentos)

## Executar em desenvolvimento

**Terminal 1 — Backend Java:**

    cd backend
    javac AgendamentoServer.java
    java AgendamentoServer
    # Rodando em http://localhost:8081

**Terminal 2 — Frontend:**

    cd frontend
    npm install
    npm run dev
    # Acesse http://localhost:5173

O Vite proxeia `/api/*` → `http://localhost:8081` automaticamente.

## Build para produção

    cd frontend
    npm run build
    # dist/ pronto para deploy no Vercel/Render/AWS

## Funcionalidades

| Módulo | Status |
|---|---|
| Dashboard com 3D + tempo real | ✅ |
| Financeiro (cashflow, contas, categorias, relatórios, saúde) | ✅ |
| Agendamentos (dia/semana/mês/stats) + Java backend | ✅ |
| CRM (clientes, perfil, pipeline kanban) | ✅ |
| Analytics + insights automáticos | ✅ |
| Configurações (perfil, equipe, integrações, plano) | ✅ |
| Acessibilidade (tema, fonte, animações) | ✅ |
| Design system completo (UI kit) | ✅ |
