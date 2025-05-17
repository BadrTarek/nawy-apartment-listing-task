# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies and generate yarn.lock
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build && yarn install --production

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules


# Set environment variables using key=value format
ENV PORT=3000 \
    NODE_ENV=production \
    HOSTNAME="0.0.0.0"

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]