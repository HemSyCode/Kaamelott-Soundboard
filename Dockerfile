# Stage 1.
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# Stage 2 (only the compiled app).
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default "nginx.conf".
COPY --from=build-stage /app/docker/nginx.conf /etc/nginx/conf.d/default.conf