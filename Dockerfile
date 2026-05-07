FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jre-headless \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g firebase-tools@13

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173 4000 8080 9099

ENTRYPOINT ["/bin/bash", "docker-entrypoint.sh"]
