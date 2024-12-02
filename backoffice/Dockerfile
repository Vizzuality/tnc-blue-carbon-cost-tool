FROM node:22.2.0-alpine

ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PASSWORD
ARG API_URL

ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_NAME $DB_NAME
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV API_URL $API_URL

WORKDIR /app


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY admin ./admin
COPY shared ./shared
COPY api ./api


RUN corepack enable pnpm


RUN pnpm install



EXPOSE 1000

# Comando para ejecutar AdminJS en producción
CMD ["pnpm", "admin:prod"]
