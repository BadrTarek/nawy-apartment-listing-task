# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies and generate yarn.lock
RUN yarn install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json .

# Install production dependencies only
RUN yarn install --production

# Copy built assets from builder stage
COPY --from=builder /app/. .


# Create volume mount point
VOLUME [ "/app/uploads" ]

# Expose port 3300
EXPOSE 3300

# Start the application
CMD ["yarn", "start"]