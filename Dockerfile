# Vite build → served by Caddy. Caddy also reverse-proxies /api and /files
# to the api container. TLS is terminated at the Cloudflare tunnel, so we
# serve plain HTTP inside the network.

FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time VITE_ vars. Default: empty — means the SPA hits /api and /files
# on the same origin, which is exactly what we want behind a tunnel.
ARG VITE_API_BASE_URL=
ARG VITE_GA_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GA_ID=$VITE_GA_ID

RUN npm run build

FROM caddy:2-alpine

COPY --from=builder /app/dist /srv
COPY deploy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
