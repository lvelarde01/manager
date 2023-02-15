     FROM node:16.18.1 as build
     RUN echo 'build state: Init'
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci
     COPY . .
     RUN npm run build

    # production environment
    FROM nginx:stable-alpine as expose
    RUN echo 'Expose state: Init'
    COPY --from=build /app/build /usr/share/nginx/html
    RUN chmod +x /usr/share/nginx/html/env.sh
    EXPOSE 80
    CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./env.sh && nginx -g 'daemon off;'"]
    
    FROM nginx:stable-alpine as testing
    RUN echo 'build state: Testing'
    RUN rm -rf /etc/nginx/conf.d
    RUN mkdir -p /etc/nginx/conf.d
    COPY ./default.conf /etc/nginx/conf.d/
    COPY ./.env /usr/share/nginx/html
    COPY ./env.sh /usr/share/nginx/html
    COPY ./build /usr/share/nginx/html
    RUN chmod +x /usr/share/nginx/html/env.sh
    EXPOSE 80
    CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./env.sh && nginx -g 'daemon off;'"]
