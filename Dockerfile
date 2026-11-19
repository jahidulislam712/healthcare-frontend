# 1. Base stage
FROM node:22-alpine AS client-base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# 2. Development stage
FROM client-base AS development

ENV NODE_ENV=development

EXPOSE 3000

CMD ["pnpm", "exec", "next", "dev", "--hostname", "0.0.0.0"]

# 3. Builder stage
FROM client-base AS builder

ARG NEXT_PUBLIC_API_BASE_URL

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN pnpm exec next build

# 4. Production stage
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

USER node

CMD ["node", "server.js"]
