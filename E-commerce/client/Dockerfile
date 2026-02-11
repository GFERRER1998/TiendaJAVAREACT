# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una config de nginx básica si es necesario, pero por ahora usamos la default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
