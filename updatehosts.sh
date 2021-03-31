#!/bin/zsh
echo "*================================================*"
echo "* Updating the host address for the test.io urls "
MINIKUBE_IP_ADDRESS=$(minikube ip)
echo "* Minikube IP is: ${MINIKUBE_IP_ADDRESS}"
echo "*================================================*"
MINIKUBE_IP_ADDRESS=`echo $MINIKUBE_IP_ADDRESS | sed 's/\./\\\./g'`
SED_COMMAND="s/[[:digit:]]*.[[:digit:]]*.[[:digit:]]*.[[:digit:]]*\ aais/${MINIKUBE_IP_ADDRESS} aais/"

cp '/etc/hosts' 'hosts input.txt'
sed -e "${SED_COMMAND}" 'hosts input.txt' > 'hosts updated.txt'
sudo cp 'hosts updated.txt' /etc/hosts
