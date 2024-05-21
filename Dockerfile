# using node version 20 (alpine: much slimmer build, faster)
FROM node:20-alpine

# set node version
ENV NODE_VERSION 20.11.1

# define working directory for container image
WORKDIR /src

# copy needed dependencies from package.json and package-lock.json
COPY package*.json ./

# copy files from current dir to container image directory
COPY . /src

# npm installs dependencies in our docker container
RUN npm install

# listen on port 3000 (because of express app routing)
EXPOSE 3000


# create docker image
CMD node app.js