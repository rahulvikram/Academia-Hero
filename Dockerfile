# using node version 20 (no alpine bc that's optimized for Linux envs)
FROM node:20

# set node version
ENV NODE_VERSION 20.11.1

# define working directory for container image
WORKDIR /app

# copy needed dependencies from package.json and package-lock.json
COPY package*.json ./

# npm installs dependencies in our docker container
RUN npm install --force
RUN pwd

# copy files from current dir to container image directory
COPY . .

# listen on port 3000 (because of express app routing)
EXPOSE 3000

# create docker image
CMD ["node", "src/app.js"]