# openIDL Upload

This project enables a user to upload a stat plan file and have it load the harmonized data store.

## local dependency
- this project assumes there is a relative local dependency called openidl-mapper.  This must be in the sibling folder of that name.
- running npm install will resolve this dependency

## to refresh this component in a local minikube runtime
- go up to the openidl-main folder
````bash
eval $(minikube -p minikube docker-env)
make refresh_upload
````
- scale down and scale up the deployment

## packaging the docker file
- using makefile at openidl-main folder
````
make build_upload
make docker_save_upload
````
- run `npm run build` to create the build
- the docker file will pick this up

## deploying to kubernetes
- run `docker build . -t openidl/upload
- this will build into the current docker registry which may be for kubernetes.  (see the openidl-k8s project read me for details.)
- you can scale down and then back up the deployment to pick up the new image

## running the ui
- from openidl-main folder `make run_upload`
