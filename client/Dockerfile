# ============================================
# 🐳 Dockerfile for the React + Vite Frontend
# Uses a "multi-stage build" (explained below)
# ============================================

# ---- STAGE 1: BUILD ----
# This stage installs dependencies and builds the production bundle
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for caching optimization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle (creates a "dist" folder)
RUN npm run build


# ---- STAGE 2: SERVE ----
# This stage uses a lightweight web server (nginx) to serve the built files
# We DON'T need Node.js anymore — just the static HTML/CSS/JS files!
FROM nginx:alpine

# Copy our built files from Stage 1 into nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
