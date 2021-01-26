FROM 343270126633.dkr.ecr.ap-northeast-2.amazonaws.com/ljit/pm2:14.4.0-alpine AS builder
ARG PHASE
WORKDIR /src
RUN apk add git
COPY . .
RUN npm install
RUN npm run build:${PHASE}

FROM 343270126633.dkr.ecr.ap-northeast-2.amazonaws.com/ljit/pm2:14.4.0-alpine
WORKDIR /src
COPY --from=builder /src /src
