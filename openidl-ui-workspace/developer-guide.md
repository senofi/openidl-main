# Angular 12 local development guide

## Introduction

The `openidl-ui-workspace` folder structure is based on the default **Angular Library** folder structure. The `openidl-common-ui` is the Angular Library project. The `openidl-ui` and `openidl-carrier-ui` are Angular Apps that consume the `openidl-common-ui` library.

More info is available here https://angular.io/guide/creating-libraries

## How to add new components or services to the openidl-common-ui library?

To generate new components or services in the library run the below command inside the `openidl-ui-workspace` folder.

```
ng generate component component-name --project openidl-common-ui
```

More info about code scaffolding is located under [`projects\openidl-common-ui\README.md`](/projects/openidl-common-ui/README.md) file.

## How to debug UI and Library projects locally?

The Angular UI projects like openidl-ui builds/dist are served as static resources via express js server and that runs on a different port `8080` whereas Angular dev server, by default, runs on `4200`.

All API request is first sent to express js server and then internally forwarded to Hosted APIs. To achieve a similar API flow during development we need to proxy app API requests from UI (4200) to the express js server (8080) port. Angular provides port forwarding and details can be found in the `proxy.conf.json` file of the root directory.

>Note: Inside `projects\openidl-ui\server\index.js` file there is logic to redirect all HTTP calls to HTTPS if `NODE_ENV` is set to `production`. To make this work we will need an `OpenSSL` certificate. To bypass this requirement for local development we have an npm package called `dotenv` which can load NODE environment variables from `.env` files. Inside the `openidl-ui-workspace` folder create a `.env` file and add the following `NODE_ENV='development'` for local development. If you are serving generated build from dist folder then use `NODE_ENV='qa'`. We don’t need this file in a production environment, hence this file is added in `.gitigonore`.

Inside the `openidl-ui-workspace` folder, run `npm start` to launch an express server on `8080` port. Form different terminal run `npm run serve`, this command will launch Angular app on `4200` with proxy for API. It means all API call to `4200` will be forwarded to port `8080` where the express server is running.

>Note: When developing `Angular Library` locally we need to run build in watch mode. There is a npm command in the package.json to run library in watch mode, `npm run watch`. This will detect any changes made to the library and re-build it.

## Production Release

To generate a production build first we need to build the `openidl-common-ui` library and then UI projects. We have below npm scripts in package.json to do so.

>Note: In the case of running it locally, make sure NODE_ENV is set to production inside the .env file.

1. The `npm run build:common` will generate an openidl-common-ui library inside the `dist\openidl-common-ui` folder.
2. The `npm run build:ui` will generate the openidl-ui App inside the `dist\openidl-ui` folder. It will use the library generated in the previous step.
3. Once the above steps are executed successfully now we can run `npm start` to start node API on `8080` port. This will serve UI App from `dist\openidl-ui`.
