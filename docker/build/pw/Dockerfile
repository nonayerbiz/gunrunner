FROM mcr.microsoft.com/playwright:v1.17.1-focal

WORKDIR /usr/src/app

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

COPY ./wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh



