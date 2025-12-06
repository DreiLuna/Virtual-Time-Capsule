FROM node:20-alpine as build

WORKDIR /app

# Install build deps and dependencies (context is ./client)
# Use `npm install` here to avoid failing when package-lock.json and package.json
# are not perfectly in sync in the repo. This also installs devDependencies
# required to run the build (vite, etc.).
COPY package*.json ./
RUN npm install

# Copy client source (copy from build context) and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to provide SPA history-mode fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
