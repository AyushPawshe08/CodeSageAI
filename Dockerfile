# ============================================
# 🐳 Single Dockerfile — Frontend + Backend
# ============================================

# ---- STAGE 1: Build the React Frontend ----
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY client/ .

# Build the production bundle (creates a "dist" folder)
RUN npm run build


# ---- STAGE 2: Final Image with Python Backend + Nginx ----
FROM python:3.11-slim

# Install Nginx and Supervisor (to run multiple processes)
RUN apt-get update && \
    apt-get install -y nginx supervisor && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ---- Setup the Backend ----
WORKDIR /app/server

# Copy and install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY server/ .

# ---- Setup the Frontend ----
# Copy the built React files from Stage 1 into Nginx
COPY --from=frontend-build /app/client/dist /usr/share/nginx/html

# ---- Nginx Config ----
# Remove default nginx config and add our own
RUN rm /etc/nginx/sites-enabled/default
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# ---- Supervisor Config ----
# Supervisor manages both Nginx and Uvicorn in a single container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 8000

# Start Supervisor (which starts both Nginx and Uvicorn)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
