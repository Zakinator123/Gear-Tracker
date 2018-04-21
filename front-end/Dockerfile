FROM node:latest

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN yarn

RUN npm install -g serve

WORKDIR /app
ADD . /app

RUN /app/run.sh build

EXPOSE 80
CMD ["serve" , "-s", "build", "-p", "80"]

# For development:  docker run --name ouva -it -p 3000:3000 -p 35729:35729 -v $(pwd):/app reactapp
# EXPOSE 3000
# EXPOSE 35729
# ENTRYPOINT ["/bin/bash", "/app/run.sh"]
# CMD ["start"]