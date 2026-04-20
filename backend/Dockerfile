FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN mkdir -p /app/storage

ENV NODE_ENV=production
ENV PORT=4000
ENV STORAGE_DIR=/app/storage
EXPOSE 4000

# On each container start: run pending migrations, then start the server.
# Migrations are idempotent (schema_migrations table tracks applied versions).
CMD ["sh", "-c", "node src/migrate.js && node src/server.js"]
