FROM node:14

RUN mkdir -p /opt/sunspotter
# Create app directory
WORKDIR /opt/sunspotter

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN apt-get update
RUN apt-get install python3

EXPOSE 3000
CMD [ "npm", "start", "app.js" ]