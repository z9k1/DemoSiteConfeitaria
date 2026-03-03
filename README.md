# DemoSiteConfeitaria

MVP institucional-comercial para confeitaria local com foco em leads via WhatsApp.

## Stack

- Next.js (App Router + SSG)
- TypeScript
- Tailwind CSS
- GitHub Pages (export estatico)

## Paginas

- `/` Home
- `/cardapio`
- `/eventos`
- `/politica-de-privacidade`

## Conversao

- Formulario de briefing envia para WhatsApp com mensagem pre-preenchida.
- Nao existe endpoint backend (`/api/lead`) no modo GitHub Pages.

## Variaveis de ambiente

Crie `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
NEXT_PUBLIC_BASE_PATH=/nome-do-repo
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=1234567890
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Rodar localmente

```bash
npm install
npm run dev
```

Build estatico:

```bash
npm run build
```

## Deploy GitHub Pages

- Workflow em `.github/workflows/deploy-pages.yml`
- Publica em `main` automaticamente para:
  - `https://usuario.github.io/nome-do-repo`
- No repositorio, habilite:
  - `Settings > Pages > Build and deployment: GitHub Actions`
