# --- build stage: compile the Angular app to static files ---
FROM node:22-alpine AS build

WORKDIR /app

# Use the npm version pinned in package.json's "packageManager" field
# (the image bundles an older npm that trips on this lockfile).
RUN corepack enable

# Install dependencies from the lockfile first so this layer is cached until
# the manifests actually change. --no-audit/--no-fund and limited sockets keep
# the install lighter (helps on memory-constrained Docker hosts).
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --maxsockets 3

# Build the production browser bundle -> dist/src/browser. Cap the V8 heap so
# the build fails loudly instead of being OOM-killed on small hosts.
ENV NODE_OPTIONS=--max_old_space_size=2048
COPY . .
RUN npm run build

# --- runtime stage: serve the static bundle with nginx ---
FROM nginx:alpine AS runtime

# SPA routing: unknown paths fall back to index.html so Angular client-side
# routes survive a page refresh / deep link.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/src/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
