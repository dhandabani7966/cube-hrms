FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/

RUN npm install

COPY frontend/ ./frontend/

WORKDIR /app/frontend
RUN npm run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 5173

CMD ["nginx", "-g", "daemon off;"]
