# CLient App running on nginx with expose port 80
FROM nginx:latest

COPY /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
