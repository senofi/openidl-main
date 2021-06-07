# openidl-k8s

This project deploys the application to kubernetes.

## Secrets

The secrets are kept in AWS Secrets Manager.

Use the load-secrets.js node script or the load_secrets make command.

There is a secret for each node following this naming convention
/openidl/<cloud>/<envt>/<node>

cloud is in (ibm, aws, local)
envt is in (stage, test, dev, prod)
node is in (aais, analytics, carrier)

-   the helm charts will look in the openidl-k8s/charts/openidl-secrets/config directory for the files to load into mounts in the image
    -   this folder is ignored in .gitignore so no secrets get checked in to git.
-   the helm chart uses the following mapping:

| filename                               | secret name               |
| -------------------------------------- | ------------------------- |
| channel-config.json                    | channel-config            |
| connection-profile.json                | connection-profile        |
| DBConfig.json                          | db-config                 |
| default.json                           | default-config            |
| email.json                             | email-config              |
| listener-channel-config.json           | listener-channel-config   |
| local-appid-config.json                | local-appid-config        |
| local-certmanager-config.json          | local-certmanager-config  |
| local-cloudant-config.json             | local-cloudant-config     |
| local-mongo-config.json                | local-mongo-config        |
| flowconfig.json                        | nifi-flowconfig           |
| s3-bucket-config.json                  | s3-bucket-config          |
| target-channel-identifiers-config.json | target-channel-config     |
| unique-identifiers-config.json         | unique-identifiers-config |

Look to each project specific helm chart to see what configs are used.

## NOTES

-   the etl needs to run in a separate cluster, so don't build it into the same cluster as the rest

-   make sure docker is installed and running
    -   turn OFF the gRPC FUSE file sharing option
-   configure minikube

```bash
minikube config set cpus 4
minikube config set memory 8192
```

-   start minikube

```bash
minikube start --driver=hyperkit
```

-   enable ingress ccontroller

```
minikube addons enable ingress
```

-   update the /etc/hosts file to include the address for the minikube ip

```
minikube ip
```

-   returns the ip to put into the etc hosts file

```
cd /etc
sudo nano hosts
```

-   at the bottom of the file put the result of the minikube ip address and the list of ingress hosts like this:

```
192.168.64.7 insurance-data-manager-aais.test.io data-call-app-aais.test.io ui-aais.test.io upload-aais.test.io
```

-   setup minikube as the docker registry
-   make sure all the images are built and available to your k8s manager (like minikube)

```bash
eval $(minikube -p minikube docker-env)
```

-   install images into the registry in minkikube
    -   see 'managing images below'

To run, in a terminal in this directory:

```shell
helm install openidl-aais .
```

To debug:

```
helm install --debug --dry-run openidl-aais .
```

## building the images

This is only necessary if you have changed the images or they are not available. If you already have the images, go to the next section.

-   go into each of the directories and run:

-   openidl-data-call-app

```bash
docker build . -t openidl/data-call-app
```

-   openidl-data-call-processor

```bash
docker build . -t openidl/data-call-processor
```

-   openidl-insurance-data-manager

```bash
docker build . -t openidl/insurance-data-manager
```

-   openidl-ui

```bash
docker build . -t openidl/ui
```

-   openidl-data-etl

```bash
docker build . -t openidl/data-etl
```

-   openidl-upload

```bash
docker build . -t openidl/upload
```

## Managing Images

-   when building images for use by the helm charts, you can move them in and out of your registry with docker save and load
-   for minikube, the images must be in the registry in minikube
-   saving from registry to local
-   cd into the openidl-iac-local directory

```bash
docker save -o ./images/openidl-ui.tar openidl/ui:latest
docker save -o ./images/openidl-insurance-data-manager.tar openidl/insurance-data-manager:latest
docker save -o ./images/openidl-data-call-processor.tar openidl/data-call-processor:latest
docker save -o ./images/openidl-data-call-app.tar openidl/data-call-app:latest
docker save -o ./images/openidl-data-etl.tar openidl/data-etl:latest
docker save -o ./images/openidl-upload.tar openidl/upload:latest
```

-   loading from local file into repository (generally don't need to do etl since it should be alone in its own cluster)

```bash
docker load -i ./images/openidl-ui.tar
docker load -i ./images/openidl-insurance-data-manager.tar
docker load -i ./images/openidl-data-call-processor.tar
docker load -i ./images/openidl-data-call-app.tar
docker load -i ./images/openidl-upload.tar
```

```
docker load -i ./images/openidl-data-etl.tar
```

-   loading into aws
    -   go into aws
    -   to to elastic container service
    -   find the repository in question and select it
    -   open the "view push commands" to see how to push
    -   you can use the image above by loading into your registry and then using the tags from here instead of from the aws doc
        -   for example use openidl/ui:latest instead of openidl-ui-stage-aais in the first part of the tagging command
-   from the directory above where the images are

```bash
docker load -i ./images/openidl-data-call-app.tar
docker tag openidl/data-call-app:latest 531234332176.dkr.ecr.us-east-1.amazonaws.com/openidl-data-call-app-stage-aais:latest
docker push 531234332176.dkr.ecr.us-east-1.amazonaws.com/openidl-data-call-app-stage-aais:latest
```

## Publishing to the github container registry

-   the following is for openidl-ui, alter the names for different images
-   get a personal access token capable of publishing to github registry see: https://nikiforovall.github.io/docker/2020/09/19/publish-package-to-ghcr.html
-   cd into the openidl-iac-local directory

```
docker load -i ./images/openidl-ui.tar
docker tag openidl/ui:latest ghcr.io/openidl-org/openidl-ui:latest
export CR_PAT=<token? ; echo $CR_PAT docker login ghcr.io -u <openidl-org username> --password-stdin
docker push ghcr.io/openidl-org/openidl-ui:latest
```

-   you may need to associate the image with the repository and make it public

## Start up with helm

-   from the openidl-k8s directory

```
helm install local-aais . -f global-values.yaml
```

## View the running environment

-   view kubernetes dashboard

```
minikube dashboard
```

-   view mongo express

```
minikube service mongo-express-service
```

-   view the insurance data manager swagger

```
minikube service local-aais-openidl-insurance-data-manager
```

-   view the data call app swagger

```
minikube service data-call-app-service
```

-   view the ui

```
minikube service local-aais-openidl-ui
```
