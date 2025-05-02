FROM node:20-alpine AS base
FROM base AS build
WORKDIR /app
RUN mkdir -p /app
RUN echo "Hello, world!" > /app/hello.txt
COPY --from=build /app/hello.txt /app/hello.txt
RUN echo "--- Listing /app ---"
RUN ls -al /app
