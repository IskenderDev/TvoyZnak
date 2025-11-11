
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27-alpine


RUN adduser -D -H -s /sbin/nologin web && \
    mkdir -p /var/cache/nginx /var/run/nginx


COPY nginx.conf /etc/nginx/nginx.conf


COPY --from=build /app/dist /usr/share/nginx/html


COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# Права на каталоги — оставим, но USER не меняем (мастер запустится от root и дропнет воркеров до 'web')
RUN chown -R web:web /usr/share/nginx/html /var/cache/nginx /var/run/nginx

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
