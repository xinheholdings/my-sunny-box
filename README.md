# My Sunny Box

A modern, responsive website for discovering products that bring joy and convenience to everyday life.

## Tech stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Run locally

Use Node.js 20.9 or newer:

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before using database-backed routes, replace `DATABASE_URL` in `.env` with a
PostgreSQL connection string, then initialize the database:

```bash
npm run db:migrate -- --name init
```

Verify and run the production build:

```bash
npm run build
npm start
```

## Upload to GitHub

Create an empty GitHub repository, open a terminal in this project, and run:

```bash
git init
git add .
git commit -m "Launch My Sunny Box"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-sunny-box.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Deploy to Vercel

1. Sign in at [vercel.com](https://vercel.com).
2. Select **Add New → Project**.
3. Import the `my-sunny-box` GitHub repository.
4. Keep the detected framework as **Next.js**.
5. Select **Deploy**.

Vercel will install the dependencies and run `npm run build`.

## Connect mysunnybox.com

1. Open the deployed project in Vercel.
2. Go to **Settings → Domains**.
3. Add `mysunnybox.com` and `www.mysunnybox.com`.
4. Add the DNS records shown by Vercel at your domain registrar.
5. Set the preferred address as the primary domain.

Vercel provisions HTTPS automatically after the domain is verified.

## Project structure

```text
my-sunny-box/
├── public/                 Static files
├── src/
│   └── app/
│       ├── globals.css    Tailwind import and global styles
│       ├── layout.tsx     Root layout and SEO metadata
│       └── page.tsx       Homepage
├── eslint.config.mjs      ESLint configuration
├── next.config.js         Next.js configuration
├── postcss.config.mjs     Tailwind PostCSS integration
├── tailwind.config.js     Tailwind theme and content paths
├── package.json           Scripts and dependencies
└── tsconfig.json          TypeScript configuration
```
