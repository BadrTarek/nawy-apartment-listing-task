FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json only (yarn.lock will be generated)
COPY package.json ./

# Copy the frontend package.json and workspace packages
COPY apps/frontend/package.json ./apps/frontend/
COPY packages ./packages

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy frontend source
COPY apps/frontend ./apps/frontend

# Build frontend
WORKDIR /app/apps/frontend
RUN yarn build

FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/package.json ./
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
