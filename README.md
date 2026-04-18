# Plutus

Sell digital products: courses, templates, presets, guides. Get a link — share — earn.

Stack: React + Vite + Tailwind. Payments via Stripe Payment Links. Deployed to GitHub Pages at [nikit34.github.io/plutus](https://nikit34.github.io/plutus/).

## Development

```sh
npm install
npm run dev
npm test
npm run build
```

## Stripe

Each product can optionally hold a Stripe Payment Link. When set, the public product page "Buy" button redirects to Stripe Checkout instead of the mock flow. Create links at [dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links).

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
