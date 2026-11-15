# Supporting Layers — Express API

The `articles-api` separates request validation, reusable helpers, and environment configuration into `validators/`, `utils/`, and `config/`. Existing endpoint response behavior is preserved.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Tasks

The app's supporting layers are organised as follows:

1. `validators/article.validator.js` exports the `createArticle` and `updateArticle` chains used by `routes/articles.js`.
2. `utils/` contains `AppError`, `asyncHandler`, and `validateRequest`; these helpers import only libraries or sibling utilities.
3. `config/index.js` is the only file that reads environment variables and exports `{ port, nodeEnv, jwtSecret, maxArticles }`.
4. `app.js`, `services/articlesService.js`, and `middleware/errorHandler.js` import configuration from `config`.
5. `.env.example` documents each configured variable; `.env` is ignored by git.

See `question.md` for the full brief and testing examples.

## Self-Audit

This search should return only the configuration module:
```bash
grep -rn "process[.]env" . | grep -v node_modules
```
