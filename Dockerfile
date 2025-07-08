# Multi-stage Dockerfile with better PostgreSQL handling
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat postgresql-client
WORKDIR /app

# Backend build stage
FROM base AS backend-deps
COPY backend/package*.json ./
RUN npm ci

FROM base AS backend-builder
COPY --from=backend-deps /app/node_modules ./node_modules
COPY backend/ .
RUN npm run build

FROM base AS backend-runner
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=backend-builder /app/dist ./dist

# Enhanced database wait script
COPY <<EOF /app/wait-for-db.sh
#!/bin/sh
echo "Starting database connection check..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if pg_isready -d "$DATABASE_URL"; then
    echo "Database is ready!"
    exec "$@"
  fi
  
  attempt=$((attempt + 1))
  echo "Database not ready. Attempt $attempt/$max_attempts. Waiting 5 seconds..."
  sleep 5
done

echo "Database connection failed after $max_attempts attempts"
exit 1
EOF
RUN chmod +x /app/wait-for-db.sh

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs
EXPOSE 3001
CMD ["/app/wait-for-db.sh", "node", "dist/main"]

# Frontend build stage
FROM base AS frontend-deps
COPY frontend/package*.json ./
RUN npm ci

FROM base AS frontend-builder
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY frontend/ .
ENV NEXT_PUBLIC_API_URL=https://celestial-backend.onrender.com
RUN npm run build

FROM base AS frontend-runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=frontend-builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]