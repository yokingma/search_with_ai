FROM node:20-alpine AS base
FROM base AS production
WORKDIR /app
RUN mkdir -p /app
RUN echo "Hello, world!" > /app/hello.txt
COPY --from=build /app/hello.txt /app/hello.txt
RUN echo "--- Listing /app ---"
RUN ls -al /app
```

You're using `FROM base AS build` and then `FROM base AS production`.  The `base` stage is implicitly `FROM node:20-alpine`.  However, the `build` stage *also* implicitly tries to pull `build:latest`.

**The Solution:**

The issue is that you don't need to specify `FROM base AS build`.  Since you've already defined `base` as `FROM node:20-alpine`, you can simplify your Dockerfile.

Here's the corrected minimal reproducible Dockerfile:


```dockerfile
FROM node:20-alpine AS base

FROM base AS production
WORKDIR /app
RUN mkdir -p /app
RUN echo "Hello, world!" > /app/hello.txt
COPY --from=0 /app/hello.txt /app/hello.txt
RUN echo "--- Listing /app ---"
RUN ls -al /app
```

**Key Changes:**

* Removed the unnecessary `FROM base AS build` line.
* Changed `COPY --from=build` to `COPY --from=0`.  `0` refers to the first stage in the Dockerfile, which is `FROM node:20-alpine AS base`.

**Reasoning:**

By removing `FROM base AS build`, we eliminate the attempt to pull the `build:latest` image.  The `COPY --from=0` instruction correctly references the `base` stage (which is based on `node:20-alpine`) as the source for the copy operation.

Please try this corrected Dockerfile. It should resolve the "pull access denied" err
