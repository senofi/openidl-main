#!/bin/bash
#set -x
#./pullConfigs-vault.sh -u root -p s.yj22jVQ35mynjayUT5xC2960 -a rest-api -o AAISOrg
#

declare -A configs=(
  ["0"]="channel-config"
  ["1"]="connection-profile"
  ["2"]="data-call-app-default-config"
  ["3"]="data-call-app-mappings-config"
  ["4"]="data-call-processor-default-config"
  ["5"]="data-call-processor-mappings-config"
  ["6"]="data-call-processor-metadata-config"
  ["7"]="default-config"
  ["8"]="deployment-scripts-ansible-aaisCA_Admin-json"
  ["9"]="deployment-scripts-ansible-aaisMSP_Admin-json"
  ["10"]="deployment-scripts-ansible-OrderingOrg_Admin-json"
  ["11"]="deployment-scripts-ansible-OrderingOrg_CA_Admin-json"
  ["12"]="deployment-scripts-token-json"
  ["13"]="email-config"
  ["14"]="insurance-data-manager-constant-config"
  ["15"]="insurance-data-manager-default-config"
  ["16"]="insurance-data-manager-mappings-config"
  ["17"]="insurance-data-manager-metadata-config"
  ["18"]="listener-channel-config"
  ["19"]="local-appid-config"
  ["20"]="local-certmanager-config"
  ["21"]="local-cloudant-config"
  ["22"]="local-cognito-config"
  ["23"]="local-db-config"
  ["24"]="local-kvs-config"
  ["25"]="local-mongo-config"
  ["26"]="local-vault-config"
  ["27"]="mappings-config"
  ["28"]="nifi-flowconfig"
  ["29"]="s3-bucket-config"
  ["30"]="target-channel-config"
  ["31"]="ui-mappings-config"
  ["32"]="unique-identifiers-config"
  ["33"]="utilities-admin-json"
)

JQ=$(which jq)
rc=$?
if [ $rc -ne 0 ]; then
  echo "Failed to execute jq command."
  exit 1
fi
if [ ! -x "${JQ}" ]; then
  echo "jq command not found."
  exit 1
fi

checkInputs() {
  if [ -z "${VAULT_URL}" ]; then
    echo "VAULT_URL not defined"
    exit 1
  fi
  if [ -z "${ORG}" ]; then
    echo "ORG not defined."
    exit 1
  fi
  if [ -z "${USER_NAME}" ]; then
    echo "USER_NAME not defined."
    exit 1
  fi
  if [ -z "${PASSWORD}" ]; then
    echo "PASSWORD not defined."
    exit 1
  fi
  if [ -z "${APP}" ]; then
    echo "APP not defined."
    exit 1
  fi
}

run() {
  echo "Entering run()"
  if [ "${USER_NAME}" != "root" ]; then
    echo "Login as root user to add data"
    LOGIN_RESPONSE=$(curl \
      --request POST \
      --data '{"password": "'${PASSWORD}'"}' \
      http://${VAULT_HOST}/v1/auth/${ORG}/login/${USER_NAME})
    rc=$?
    if [ $rc -ne 0 ]; then
      echo "Failed to execute curl command."
      exit 1
    fi
    echo LOGIN_RESPONSE=${LOGIN_RESPONSE}
    USER_TOKEN=$(echo ${LOGIN_RESPONSE} | ${JQ} ".auth.client_token" | sed "s/\"//g")
  else
    USER_TOKEN=${PASSWORD}
  fi
  echo "Token is ${USER_TOKEN}"

  # temp configs folder
  mkdir ./configs

  echo "Retrieve configs"
  for config in "${!configs[@]}"; do
    CURL_RESPONSE=$(curl \
      --header "X-Vault-Token: ${USER_TOKEN}" \
      --request GET \
      ${VAULT_URL}/v1/${ORG}/data/${APP}/${configs[${config}]})
    rc=$?
    if [ $rc -ne 0 ]; then
      echo "Failed to execute curl command."
      exit 1
    fi

    CONFIG_DATA=$(echo $CURL_RESPONSE | $JQ ".data.data")

    if [ -z "${CONFIG_DATA}" ]; then
      echo "CONFIG_DATA is blank."
      exit 1
    fi

    #Write config files
    echo "${CONFIG_DATA}" >./configs/${configs[${config}]}.json
  done

  echo "All configs downloaded completed."

}

VAULT_URL='http://127.0.0.1:8200'
ORG=AAISOrg
USER_NAME=""
PASSWORD=""
APP=""
while getopts "H:u:p:hU:P:o:a:e:" opt; do
  case ${opt} in
  H)
    VAULT_URL=${OPTARG}
    ;;
  u)
    USER_NAME=${OPTARG}
    ;;
  p)
    PASSWORD=${OPTARG}
    ;;
  a)
    APP=${OPTARG}
    ;;
  o)
    ORG=${OPTARG}
    ;;
  \?)
    echo "Unknown option. ${OPT}"
    ;;
  esac
done

checkInputs
run

exit 0
