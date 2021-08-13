#!/bin/sh
echo "Here we setup the system from start to finish."

echo "Setting up hyperledger fabric local test network"
cd openidl-test-network
./start.sh
cd ..

echo "Setting up minikube"
make delete_minikube
make start_minikube

echo "Enable ingress and update hosts"
make enable_ingress
./updatehosts.sh

echo "Copy hyperledger fabric local test network connection profile"
cp -R ./openidl-test-network/organizations/peerOrganizations/aais.example.com/connection-aais.json ./openidl-k8s/charts/openidl-secrets/config/connection-profile.json 

echo "Install application helm charts"
# make load_images
make install_in_k8s
