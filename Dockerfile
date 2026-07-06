FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm client:build
RUN pnpm prune --prod

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Express API
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

# Nuxt SSR output (self-contained with its own node_modules)
COPY --from=build /app/client/.output ./client/.output

# Startup script
COPY docker-start.sh .
RUN chmod +x docker-start.sh

EXPOSE 3000
EXPOSE 5000
CMD ["./docker-start.sh"]
