# Usar una imagen oficial de Node.js
FROM node:18

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajústalo según tu app)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
