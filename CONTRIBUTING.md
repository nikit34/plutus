# Contributing

Thanks for considering a contribution.

## Setup

See the **Quick start** section in [`README.md`](README.md). You need Node 20+, Docker (for Postgres), and a Stripe test account.

## Workflow

1. Fork the repo and create a topic branch from `main`.
2. Run `npm install` at the repo root and inside `backend/`.
3. Run the test suites before pushing:
   - Frontend: `npm test`
   - Backend: `cd backend && npm test`
4. Open a pull request with a clear description and a screenshot/GIF for any UI change.

## Reporting bugs and proposing features

Use the issue templates under <https://github.com/nikit34/plutus/issues/new/choose>. For security issues, see [`SECURITY.md`](SECURITY.md) — do **not** open a public issue.

## Style

- Match existing patterns. Don't introduce new dependencies for trivial helpers.
- Don't add comments that restate what the code does. Comments are for the *why*.
- Run `npm run lint` and fix warnings touching files you've changed.

## License

By contributing you agree that your work is licensed under the MIT License (see [`LICENSE`](LICENSE)).
