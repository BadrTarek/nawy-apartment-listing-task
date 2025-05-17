FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json only (yarn.lock will be generated)
COPY package.json ./

# Copy the backend package.json
COPY apps/backend/package.json ./apps/backend/
COPY packages ./packages

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy backend source
COPY apps/backend ./apps/backend

# Build backend
WORKDIR /app/apps/backend
RUN yarn build

FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
