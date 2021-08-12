FROM node:14-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache \
    bash \
    git \
    python \
    make \
    g++

WORKDIR /app
COPY . .

RUN npm install @angular/cli@12.1.0 -g

RUN mv -f npmrc ~/.npmrc 2>/dev/null; true
RUN npm install

RUN mkdir lib
RUN cp -r node_modules/openidl-common-ui/* lib/


RUN ng config -g cli.warnings.versionMismatch false
RUN ng build --prod

EXPOSE 8080
CMD [ "npm","start"]