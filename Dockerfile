FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM node:18-alpine as baseprod
#RUN apk add --no-cache g++ make py3-pip libc6-compat
ADD --keep-git-dir=true https://github.com/goonca/onebox-project-client.git#master /onebox-project-client
EXPOSE 3010

FROM base as dev
ENV NODE_ENV=development
RUN yarn install --network-timeout 1000000
COPY . .
CMD yarn dev

FROM base as builder
WORKDIR /app
COPY . .
ENV BUILD_STANDALONE=true
RUN yarn build


FROM baseprod as production
WORKDIR /app

ENV NODE_ENV=production
RUN yarn install --network-timeout 1000000


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD yarn start

