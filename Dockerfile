# Works on Railway, Fly.io, Koyeb, a VPS, or anywhere Docker runs.
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=8080 TRUST_PROXY=1 DEMO_MODE=true
EXPOSE 8080
CMD ["npm", "start"]
