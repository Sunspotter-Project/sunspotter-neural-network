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
RUN apt-get install python3 python3-pip -y
RUN pip3 install --upgrade pip
RUN pip3 install requests pysqlite3 numpy pillow
#RUN pip3 install "tensorflow>=1.15,<2.0"
RUN pip3 install "tensorflow>=2.0"
RUN pip3 install --upgrade tensorflow-hub

EXPOSE 3000
CMD [ "npm", "start", "app.js" ]