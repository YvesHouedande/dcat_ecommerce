# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances avec npm
RUN npm ci

# Copier les variables d'environnement (si utilisées dans le build)
COPY .env ./

# Copier tout le code source
COPY . ./

# Build du projet (adapter selon ton framework : vite, react-scripts, etc.)
RUN npm run build

# Vérifie le contenu du build (utile pour le debug)
RUN ls -la /app/dist

# Production Stage avec NGINX
FROM nginx:alpine AS production

# Copier le build du stage précédent
COPY --from=build /app/dist /usr/share/nginx/html

# Copier une configuration nginx personnalisée (facultatif)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port utilisé dans nginx.conf (par défaut 80, sinon adapter ici)
EXPOSE 9090

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
