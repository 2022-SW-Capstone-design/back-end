FROM node:14

RUN mkdir -p /home/app
ENV HOME=/home/app

WORKDIR $HOME

COPY ./package*.json $HOME/
# RUN npm install
RUN npm ci --only=production
RUN npm install -g pm2 

COPY ./.env $HOME/
COPY . $HOME

RUN chmod 755 $HOME/docker-entrypoint.sh
RUN $HOME/docker-entrypoint.sh

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]

EXPOSE 8081
