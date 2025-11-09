# Use an official Node.js LTS image (includes npm, build tools)
FROM node:20-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching npm install)
COPY package*.json ./

# Install system dependencies for canvas and sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    libpangocairo-1.0-0 \
    libpng-dev \
    libtiff5-dev \
    libwebp-dev \
    libtool \
    pkg-config \
 && rm -rf /var/lib/apt/lists/*

# Install Node dependencies
RUN npm install --production

# Copy all project files into the container
COPY . .

# Expose the API port
EXPOSE 4887

# Default environment variables
ENV PORT=4887
ENV NODE_ENV=production

# Start the API
CMD ["node", "index.js"]
