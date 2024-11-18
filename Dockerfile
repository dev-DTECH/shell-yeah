FROM node:18

WORKDIR /app

# Install dependencies
COPY package.json .
COPY shell-yeah-web/package.json ./shell-yeah-web/package.json
COPY shell-yeah-server/package.json ./shell-yeah-server/package.json
RUN npm install --verbose

# Copy source code
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]