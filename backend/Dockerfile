FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/

RUN npm install

COPY backend/ ./backend/

WORKDIR /app/backend
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app/backend

ENV NODE_ENV=production

COPY package.json package-lock.json* /app/
COPY backend/package.json ./

RUN npm install --omit=dev

COPY --from=builder /app/backend/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]
