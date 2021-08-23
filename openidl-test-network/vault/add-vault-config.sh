#!/bin/bash
#set -x
#
#./add-vault-user.sh -t s.NChugw1IiynKI3q6Zb674U4N -U user-data-call-app -P password -a data-call-app -o AAISOrg -e '"create","update","read"'
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
  # ["14"]="insurance-data-manager-constant-config"
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
  if [ -z "${USER_TOKEN}" ]; then
    echo "USER_TOKEN is not defined."
    exit 1
  fi
  if [ -z "${USER_TO_BE_CREATED}" ]; then
    echo "USER_TO_BE_CREATED is not defined."
    exit 1
  fi
  if [ -z "${PASSWORD_TO_BE_CREATED}" ]; then
    echo "PASSWORD_TO_BE_CREATED is not defined."
    exit 1
  fi
  if [ -z "${APP}" ]; then
    echo "APP is not defined."
    exit 1
  fi
  if [ -z "${PERMISSIONS}" ]; then
    echo "PERMISSIONS is not defined."
    exit 1
  fi
  if [ -z "${CONFIG_PATH}" ]; then
    echo "CONFIG_PATH is not defined."
    exit 1
  fi
}

addVaultConfig() {
  echo "Entering addVaultConfig()"

  echo "Enable userpass authentication"
  HTTP_STATUS=$(curl --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data '{"type": "userpass"}' \
    ${VAULT_URL}/v1/sys/auth/${ORG} --insecure -s -o /dev/null -w "%{http_code}")
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  HTTP_STATUS=${HTTP_STATUS}
  if [ "${HTTP_STATUS}" != "204" ]; then
    echo "Error in Invoking Vault with status ${HTTP_STATUS}."
    exit 1
  fi

  echo "Enable path for storing config data"
  HTTP_STATUS=$(curl --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data '{"type":"kv","options":{"version":2},"generate_signing_key":true}' \
    ${VAULT_URL}/v1/sys/mounts/${ORG} --insecure -s -o /dev/null -w "%{http_code}")
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  HTTP_STATUS=${HTTP_STATUS}
  if [ "${HTTP_STATUS}" != "204" ]; then
    echo "Error in Invoking Vault with status ${HTTP_STATUS}."
    exit 1
  fi

  POLICY_FILE=$(mktemp).json
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute mktemp."
    exit 1
  fi
  echo "Create policy file ${POLICY_FILE}."
  PERMISSIONS=$(echo $PERMISSIONS | sed 's/\"/\\\"/g')
  cat >${POLICY_FILE} <<EOF
        {
            "policy": "path \"${ORG}/data/${APP}/*\" { capabilities = [ ${PERMISSIONS} ]}"
        }
EOF
  echo "Add policy"
  HTTP_STATUS=$(curl \
    --header "X-Vault-Token: ${USER_TOKEN}" \
    --request PUT \
    --data @${POLICY_FILE} \
    ${VAULT_URL}/v1/sys/policy/${USER_TO_BE_CREATED}-policy --insecure -s -o /dev/null -w "%{http_code}")
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  HTTP_STATUS=${HTTP_STATUS}
  if [ "${HTTP_STATUS}" != "204" ]; then
    echo "Error in Invoking Vault with status ${HTTP_STATUS}."
    exit 1
  fi
  rm ${POLICY_FILE}
  POLICY_FILE=$(mktemp).json
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute mktemp."
    exit 1
  fi
  echo "Create policy file ${POLICY_FILE}."
  cat >${POLICY_FILE} <<EOF
        {
            "password": "${PASSWORD_TO_BE_CREATED}",
            "policies": "${USER_TO_BE_CREATED}-policy"
        }
EOF
  echo "Create new user"
  HTTP_STATUS=$(curl \
    --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data @${POLICY_FILE} \
    ${VAULT_URL}/v1/auth/${ORG}/users/${USER_TO_BE_CREATED} --insecure -s -o /dev/null -w "%{http_code}")
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  HTTP_STATUS=${HTTP_STATUS}
  if [ "${HTTP_STATUS}" != "204" ]; then
    echo "Error in Invoking Vault with status ${HTTP_STATUS}."
    exit 1
  fi
  rm ${POLICY_FILE}
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to remove ${POLICY_FILE}."
    exit 1
  fi

  for config in "${!configs[@]}"; do echo "$config - ${configs[$config]}"; done

  echo "Login as the new user to add configuration files"
  USER_TOKEN=$(curl \
    --request POST \
    --data '{"password": "${PASSWORD_TO_BE_CREATED}"}' \
    ${VAULT_URL}/v1/auth/${ORG}/login/${USER_TO_BE_CREATED} --insecure)

  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Failed to execute curl."
    exit 1
  fi
  USER_TOKEN=${USER_TOKEN}
  USER_TOKEN=$(echo ${USER_TOKEN} | ${JQ} ".auth.client_token" | sed "s/\"//g")
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

  echo "All completed."
}

VAULT_URL='http://127.0.0.1:8200'
ORG=AAISOrg
USER_NAME=""
PASSWORD=""
USER_TO_BE_CREATED=""
PASSWORD_TO_BE_CREATED=""
APP=""
CONFIGPATH=""
while getopts "V:t:U:P:a:o:e:c:" key; do
  case ${key} in
  V)
    VAULT_URL=${ARG}
    ;;
  t)
    USER_TOKEN=${ARG}
    ;;
  U)
    USER_TO_BE_CREATED=${ARG}
    ;;
  P)
    PASSWORD_TO_BE_CREATED=${ARG}
    ;;
  a)
    APP=${ARG}
    ;;
  o)
    ORG=${ARG}
    ;;
  e)
    PERMISSIONS=${ARG}
    ;;
  c)
    CONFIG_PATH=${ARG}
    ;;
  h)
    echo "add-vault-user.sh -H http://VAULT_HOST:VAULT_PORT -u VAULT_USER -p  VAULT_PASSWORD -f"
    exit 0
    ;;
  \?)
    echo "Unknown flag: ${key}"
    ;;
  esac
done

checkOptions
addVaultConfig

exit 0
