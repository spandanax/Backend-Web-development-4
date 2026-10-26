# Authentication Fundamentals

## Setup

```bash
npm install
copy .env.example .env
npm run db:push
npm start
```

The SQLite datasource keeps local setup self-contained. Configure `DATABASE_URL`,
`PORT`, and `BCRYPT_COST` in `.env` as needed. Do not commit `.env` or
`prisma/dev.db`.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`

Registration accepts `name`, `email`, and `password`. It trims the name,
normalizes the email, and stores only an asynchronous bcrypt hash. A successful
registration returns `201` and only the user's `id`, `name`, and `email`.
Duplicate normalized emails return `409`.

Login accepts `email` and `password`. A successful login returns `200` and the
same safe user fields. An unknown email and an incorrect password return the
same generic `401` response. Missing or blank required fields return `400`.

Authentication logic lives in the service layer; Prisma queries are isolated in
the user repository.
