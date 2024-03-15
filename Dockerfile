FROM node:16.13.2-alpine

ARG SERVER_PROFILE=dev
ENV PORT 3000

WORKDIR /usr/src/app

COPY package*.json ./
COPY src/lib/mobiscroll-package/* ./src/lib/mobiscroll-package/

RUN npm install

COPY . .

RUN npm run build:${SERVER_PROFILE}

CMD ["npm", "run", "start"]
#CMD tail -f /dev/null
