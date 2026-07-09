# --- build stage: compile the Angular app to static files ---
FROM node:22-alpine AS build

WORKDIR /app

# Use the npm version pinned in package.json's "packageManager" field
# (the image bundles an older npm that trips on this lockfile).
RUN corepack enable

# Install dependencies from the lockfile first so this layer is cached until
# the manifests actually change.
COPY package.json package-lock.json ./
RUN npm ci

# Build the production browser bundle -> dist/src/browser
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
