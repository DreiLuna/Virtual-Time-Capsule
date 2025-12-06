FROM node:18-alpine

WORKDIR /app

# Optional build deps for native modules (keep, but harmless on Alpine)
RUN apk add --no-cache python3 make g++ || true

# Copy only server package files and install server dependencies into the image
# This avoids installing client deps in the server image.
COPY server/time_capsule/package*.json ./server/time_capsule/
# Use `npm install` to ensure dependencies are installed even if package-lock.json
# and package.json are not perfectly in sync inside the image build context.
RUN npm install --production --prefix server/time_capsule

# Copy the rest of the repository
COPY . .

# Expose the app port (adjust if your app reads APP_PORT)
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Default command — change path if your server entry is elsewhere
CMD ["node", "server/time_capsule/index.js"]
