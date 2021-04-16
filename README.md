# openIDL Main
This is the main repostiory for openidl

All projects are contained in subdirectories

This is a single monorepository

## contributing
Here is a course on how to contribute to open source: https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github

## Current Backlog
- there is a backlog of work necessary to get everything running from github as open source.
- please refer to [backlog](./BACKLOG.md) for more information

# Quick Start
- make sure you have the prerequisites.  See below for #prerequisites
- make sure you are in the openidl-main directory.  The same as this README.md file.
- to get up and running quickly with the reference implementation, run: (see note below about vpm and ingress add on)
````bash
./systemup.sh
````
- to free up resources and close everything, run:
````bash
./systemdown.sh
````

You can use make to execute most of the commands necessary to set up the environment and test it

Give docker as much space as you can.  8G is probably good.

## NOTE: vpn and ingress add on
I think you need to be off the vpn for the enable ingress to work. You may be able to reconnect to the vpn after the ingress add on is enabled.

When asked for the password, this is for sudo, so it should be the administrator of your machine, most likely the password when you start your machine.

The ./systemup.sh script will execute the following

````bash
make delete_minikube
make start_minikube
make enable_ingress
make check_minikube_ip
make update_hosts
eval $(minikube -p minikube docker-env)
docker images
make load_images
make install_in_k8s
````

Once the system is up you can do the following

- change to another terminal and run the dashboard.  This will block.
````
make dashboard
````
- other things you can do to see different apis etc
````
make run_ui
make run_upload
make run_insurance_data_manager
make run_data_call_app
make run_mongo_express
````

# Experimental
To make everything work for everyone, we are using virtual machines for the reference implementation.
We provide an importable virtual machine.

username=openidl
password=openidl

## use the minifab network to run the examples


# Prerequisites
- you may want to use a VirtualBox ubuntu virtual machine to run the reference implementation see section below on setup 
- NOTE: it seems there is an issue with 6.x and autosizing the screen.  Consider using 5.2.x instead.  You can also scale the window to make it bigger.
- [here is a video](https://youtu.be/aJcc-xC6krE)
- install git
````bash
sudo apt install git-all
````
- [install docker](https://docs.docker.com/engine/install/ubuntu/)
````bash
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo docker run hello-world
````
- [install minikube](https://minikube.sigs.k8s.io/docs/start/)
````bash
 curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
 sudo install minikube-linux-amd64 /usr/local/bin/minikube
 ````
- install make
````bash
sudo apt-get install build-essential
````

- install libvert
````bash
sudo apt update
sudo apt install qemu-kvm libvirt-daemon-system
````