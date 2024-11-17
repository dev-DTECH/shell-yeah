FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json .
COPY shell-yeah-web/package.json ./shell-yeah-web/package.json
COPY shell-yeah-server/package.json ./shell-yeah-server/package.json
RUN npm install --verbose

# Copy source code
COPY ./shell-yeah-web ./shell-yeah-web
COPY ./shell-yeah-server ./shell-yeah-server

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]