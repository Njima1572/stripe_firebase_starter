FROM node:14
EXPOSE 3000
ENV PORT=3000
ARG stripe_pk
ENV STRIPE_PK=$tripe_pk

WORKDIR /app

ENTRYPOINT yarn dev --host --port $PORT

