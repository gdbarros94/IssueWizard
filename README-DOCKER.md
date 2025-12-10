# Docker Deployment Guide

This guide explains how to run IssueWizard using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start with Docker Compose

The easiest way to run IssueWizard is using Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at http://localhost:8090

## Building with Docker

If you prefer to use Docker directly without Docker Compose:

```bash
# Build the Docker image
docker build -t issuewizard:latest .

# Run the container
docker run -d -p 8090:8090 --name issuewizard-app issuewizard:latest

# View logs
docker logs -f issuewizard-app

# Stop and remove the container
docker stop issuewizard-app
docker rm issuewizard-app
```

## Configuration

### Environment Variables

You can customize the deployment using the `.env` file:

```env
# Port on which the application will be served
PORT=8090

# Node environment
NODE_ENV=production
```

To use a different port, modify the `.env` file before starting the container.

### Custom Port Example

To run on port 3000 instead of 8090:

```bash
# Option 1: Edit .env file
echo "PORT=3000" > .env
docker-compose up -d

# Option 2: Use environment variable
PORT=3000 docker-compose up -d

# Option 3: Direct docker run
docker run -d -p 3000:8090 --name issuewizard-app issuewizard:latest
```

## Architecture

The Docker setup uses a multi-stage build:

1. **Build Stage**: Uses Node.js 18 Alpine to install dependencies and build the React application
2. **Production Stage**: Uses Nginx Alpine to serve the static files efficiently

### Benefits

- **Lightweight**: Final image is optimized and minimal
- **Fast**: Nginx serves static files with excellent performance
- **Secure**: Only production dependencies are included
- **Portable**: Runs consistently across different environments

## Docker Compose Features

The `docker-compose.yml` includes:

- Port mapping (8090:8090)
- Environment variable support from `.env` file
- Automatic restart policy
- Health checks for monitoring
- Named container for easy management

## Health Check

The container includes a health check that verifies the application is responding:

```bash
# Check container health
docker ps

# Manual health check
docker exec issuewizard-app wget --quiet --tries=1 --spider http://localhost:8090 || echo "unhealthy"
```

## Publishing to Docker Hub (Future)

To publish the image to Docker Hub:

```bash
# Tag the image
docker tag issuewizard:latest your-dockerhub-username/issuewizard:latest
docker tag issuewizard:latest your-dockerhub-username/issuewizard:v0.1.0

# Push to Docker Hub
docker push your-dockerhub-username/issuewizard:latest
docker push your-dockerhub-username/issuewizard:v0.1.0
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs
```

### Port already in use

Change the port in `.env` file or use a different external port:
```bash
docker run -d -p 8091:8090 --name issuewizard-app issuewizard:latest
```

### Build fails

If the build fails due to network issues, retry:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Accessing the application

After starting the container, open your browser to:
- http://localhost:8090 (or your configured port)

## Development vs Production

This Docker setup is optimized for production deployment. For development:

```bash
# Use the standard npm start command
npm install
npm start
```

## Additional Commands

```bash
# Rebuild without cache
docker-compose build --no-cache

# View container stats
docker stats issuewizard-app

# Execute commands inside container
docker exec -it issuewizard-app sh

# Remove all containers and images
docker-compose down --rmi all
```
