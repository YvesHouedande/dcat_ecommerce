# # Build Stage
# FROM node:18-alpine AS build

# WORKDIR /app

# # Copier les fichiers package.json et package-lock.json
# COPY package.json package-lock.json ./

# # Installer les dépendances avec npm
# RUN npm ci

# # Copier les variables d'environnement (si utilisées dans le build)
# COPY .env ./

# # Copier tout le code source
# COPY . ./

# # Build du projet (adapter selon ton framework : vite, react-scripts, etc.)
# RUN npm run build

# # Vérifie le contenu du build (utile pour le debug)
# RUN ls -la /app/dist

# # Production Stage avec NGINX
# FROM nginx:alpine AS production

# # Copier le build du stage précédent
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copier une configuration nginx personnalisée (facultatif)
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Exposer le port utilisé dans nginx.conf (par défaut 80, sinon adapter ici)
# EXPOSE 9090

# # Démarrer nginx
# CMD ["nginx", "-g", "daemon off;"]
# Étape 1 - Build Vite avec les variables d'env
FROM node:18-alpine AS build

WORKDIR /app

# Copier package.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier les sources + fichier .env généré par GitHub Actions
COPY . .

# Lancer le build (les variables VITE_ seront injectées ici)
RUN npm run build

# Étape 2 - Serveur nginx pour héberger le site statique
FROM nginx:alpine AS production

# Copier le build de l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Ajouter config nginx personnalisée si besoin
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9090

CMD ["nginx", "-g", "daemon off;"]
