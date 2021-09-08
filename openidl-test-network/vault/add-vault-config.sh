#!/bin/bash
#set -x
#
#./add-vault-config.sh -U user-data-call-app -P password -a data-call-app -o AAISOrg -c ../../openidl-k8s/charts/openidl-secrets/config
#

declare -r configs=(
  ["0"]="channel-config"
  ["1"]="connection-profile"
  ["2"]="data-call-app-default-config"
  ["3"]="data-call-app-mappings-config"
  ["4"]="data-call-processor-default-config"
  ["5"]="data-call-processor-mappings-config"
  ["6"]="data-call-processor-metadata-config"
  ["7"]="default-config"
  ["8"]="email-config"
  ["9"]="insurance-data-manager-channel-config"
  ["10"]="insurance-data-manager-default-config"
  ["11"]="insurance-data-manager-mappings-config"
  ["12"]="insurance-data-manager-metadata-config"
  ["13"]="listener-channel-config"
  ["14"]="local-cognito-config"
  ["15"]="local-db-config"
  ["16"]="local-kvs-config"
  ["17"]="mappings-config"
  ["18"]="s3-bucket-config"
  ["19"]="target-channel-config"
  ["20"]="ui-mappings-config"
  ["21"]="unique-identifiers-config"
  ["22"]="utilities-admin-json"
)

JQ=$(which jq)
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "Failed to execute jq."
  exit 1
fi
if [ ! -x "${JQ}" ]; then
  echo "jq not found."
  exit 1
fi

checkOptions() {
  if [ -z "${VAULT_URL}" ]; then
    echo "VAULT_URL is not defined"
    exit 1
  fi
  if [ -z "${ORG}" ]; then
    echo "ORG is not defined."
    exit 1
  fi
  if [ -z "${USER_NAME}" ]; then
    echo "USER_NAME is not defined."
    exit 1
  fi
  if [ -z "${PASSWORD}" ]; then
    echo "PASSWORD is not defined."
    exit 1
  fi
  if [ -z "${APP}" ]; then
    echo "APP is not defined."
    exit 1
  fi
  if [ -z "${CONFIG_PATH}" ]; then
    echo "CONFIG_PATH is not defined."
    exit 1
  fi
}

addVaultConfig() {
  echo "Entering add vault config script"

  echo "Login to add configuration files"
  LOGIN_RESPONSE=$(curl \
    --request POST \
    --data "{\"password\":\"${PASSWORD}\"}" \
    ${VAULT_URL}/v1/auth/${ORG}/login/${USER_NAME} --insecure)

  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  LOGIN_RESPONSE=${LOGIN_RESPONSE}
  USER_TOKEN=$(echo ${LOGIN_RESPONSE} | ${JQ} ".auth.client_token" | sed "s/\"//g")
  echo "USER_TOKEN is ${USER_TOKEN}"

  for config in "${!configs[@]}"; do
    signcerts=$(cat ${CONFIG_PATH}/${configs[$config]}.json)
    echo ${signcerts}

    JSON_DATA_PAYLOAD="{\"data\":${signcerts}}"

    echo "JSON_DATA_PAYLOAD=${JSON_DATA_PAYLOAD}"
    echo "Add data to vault for ORG=${ORG}, COMPONENT=${APP}"
    HTTP_STATUS=$(curl \
      --header "X-Vault-Token: ${USER_TOKEN}" \
      --request POST \
      --data "${JSON_DATA_PAYLOAD}" \
      ${VAULT_URL}/v1/${ORG}/data/${APP}/${configs[$config]} --insecure -s -o /dev/null -w "%{http_code}")
    RESULT=$?
    if [ $RESULT -ne 0 ]; then
      echo "Failed to execute curl."
      exit 1
    fi
    echo "HTTP_STATUS=${HTTP_STATUS}"
    if [ "${HTTP_STATUS}" != "200" ]; then
      echo "API call didn't return 200."
      exit 1
    fi
  done

  echo "All configs have been uploaded successfully."
}

VAULT_URL='http://127.0.0.1:8200'
ORG=AAISOrg
USER_NAME=""
PASSWORD=""
APP=""
CONFIGPATH=""
while getopts "V:U:P:a:o:c:" key; do
  case ${key} in
  V)
    VAULT_URL=${OPTARG}
    ;;
  U)
    USER_NAME=${OPTARG}
    ;;
  P)
    PASSWORD=${OPTARG}
    ;;
  a)
    APP=${OPTARG}
    ;;
  o)
    ORG=${OPTARG}
    ;;
  c)
    CONFIG_PATH=${OPTARG}
    ;;
  \?)
    echo "Unknown flag: ${key}"
    ;;
  esac
done

checkOptions
addVaultConfig

exit 0
