FROM node:22.14.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# --- Use Nginx for Serving the App ---
FROM nginx:alpine

# Create SSL folder inside container
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates into the container
COPY certs/STAR_gdinexus_com.crt /etc/nginx/ssl/STAR_gdinexus_com.crt
COPY certs/STAR_gdinexus_com.key /etc/nginx/ssl/STAR_gdinexus_com.key

# Copy the custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the correct port
EXPOSE 59181

CMD ["nginx", "-g", "daemon off;"]
