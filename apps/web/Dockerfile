FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm -g add turbo@1.12.4
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS runner
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g pnpm

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/full/ .
RUN pnpm install --filter web

# Build the project
RUN pnpm run build --filter web

CMD pnpm -C ./apps/web run start