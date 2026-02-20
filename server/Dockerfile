# ============================================
# 🐳 Dockerfile for the FastAPI Backend Server
# ============================================

# STEP 1: Use an official Python image as the base
# "slim" means a smaller version (less bloat, faster to download)
FROM python:3.11-slim

# STEP 2: Set the working directory inside the container
# All commands after this will run from /app
WORKDIR /app

# STEP 3: Copy ONLY the requirements file first
# This is a Docker optimization — if requirements don't change,
# Docker will use a cached version and skip re-installing
COPY requirements.txt .

# STEP 4: Install Python dependencies
# --no-cache-dir = don't store pip cache (keeps image small)
RUN pip install --no-cache-dir -r requirements.txt

# STEP 5: Copy the rest of the application code
COPY . .

# STEP 6: Tell Docker that this container will listen on port 8000
EXPOSE 8000

# STEP 7: The command to run when the container starts
# "0.0.0.0" means accept connections from anywhere (required in Docker)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
