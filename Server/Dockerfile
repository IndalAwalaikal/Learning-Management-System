FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 5000

CMD ["sh", "entrypoint.sh"]
