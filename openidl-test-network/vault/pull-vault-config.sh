#!/bin/bash
#set -x
#./pull-vault-config.sh -U user-data-call-app -P password -a data-call-app -o AAISOrg -c ./configs
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
  echo "Failed to execute jq command."
  exit 1
fi
if [ ! -x "${JQ}" ]; then
  echo "jq command not found."
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

pullVaultConfig() {
  echo "Entering pullVaultConfig()"

  echo "Login to pull config data"
  LOGIN_RESPONSE=$(curl \
    --request POST \
    --data "{\"password\":\"${PASSWORD}\"}" \
    ${VAULT_URL}/v1/auth/${ORG}/login/${USER_NAME})
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  echo LOGIN_RESPONSE=${LOGIN_RESPONSE}
  USER_TOKEN=$(echo ${LOGIN_RESPONSE} | ${JQ} ".auth.client_token" | sed "s/\"//g")
  echo "Token is ${USER_TOKEN}"

  echo "Pull all configs"
  for config in "${!configs[@]}"; do
    HTTP_STATUS=$(curl \
      --header "X-Vault-Token: ${USER_TOKEN}" \
      --request GET \
      ${VAULT_URL}/v1/${ORG}/data/${APP}/${configs[${config}]})
    RESULT=$?
    if [ $RESULT -ne 0 ]; then
      echo "Failed to execute curl command."
      exit 1
    fi

    CONFIG_DATA=$(echo $HTTP_STATUS | $JQ ".data.data")

    if [ -z "${CONFIG_DATA}" ]; then
      echo "CONFIG_DATA is blank."
      exit 1
    fi

    #Write config files
    echo "${CONFIG_DATA}" >${CONFIG_PATH}/${configs[${config}]}.json
  done

  echo "All configs downloaded completed."

}

VAULT_URL='http://127.0.0.1:8200'
ORG=AAISOrg
USER_NAME=""
PASSWORD=""
APP=""
CONFIG_PATH=""
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
pullVaultConfig

exit 0
