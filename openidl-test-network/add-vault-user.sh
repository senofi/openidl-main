#!/bin/bash
#set -x
#
#./add-vault-user.sh -u root -p s.NChugw1IiynKI3q6Zb674U4N -U rcbj0001 -P changeit -a rest-api -o AAISOrg -e '"create","update","read"'
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
  if [ -z "${USER_TO_BE_CREATED}" ]; then
    echo "USER_TO_BE_CREATED not defined."
    exit 1
  fi
  if [ -z "${PASSWORD_TO_BE_CREATED}" ]; then
    echo "PASSWORD_TO_BE_CREATED not defined."
    exit 1
  fi
  if [ -z "${APP}" ]; then
    echo "APP not defined."
    exit 1
  fi
  if [ -z "${PERMISSIONS}" ]; then
    echo "PERMISSIONS not defined."
    exit 1
  fi
}

run() {
  echo "Entering run()"
  if [ "${USER_NAME}" != "root" ]; then
    echo "Login as script to add data"
    LOGIN_RESPONSE=$(curl \
      --request POST \
      --data '{"password": "'${PASSWORD}'"}' \
      http://${VAULT_HOST}/v1/auth/${ORG}/login/${USER_NAME} --insecure)
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

  echo "Enable authentication."
  CURL_RESPONSE=$(curl --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data '{"type": "userpass"}' \
    ${VAULT_URL}/v1/sys/auth/${ORG} --insecure -s -o /dev/null -w "%{http_code}")
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  CURL_RESPONSE=${CURL_RESPONSE}
  if [ "${CURL_RESPONSE}" != "204" ]; then
    echo "API call didn't return 204."
    exit 1
  fi

  echo "Enable secret engine with path"
  CURL_RESPONSE=$(curl --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data '{"type":"kv","options":{"version":2},"generate_signing_key":true}' \
    ${VAULT_URL}/v1/sys/mounts/${ORG} --insecure -s -o /dev/null -w "%{http_code}")
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  CURL_RESPONE=${CURL_RESPONSE}
  if [ "${CURL_RESPONSE}" != "204" ]; then
    echo "API call didn't return 204."
    exit 1
  fi

  POLICY_FILE=$(mktemp).json
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute mktemp command."
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
  CURL_RESPONSE=$(curl \
    --header "X-Vault-Token: ${USER_TOKEN}" \
    --request PUT \
    --data @${POLICY_FILE} \
    ${VAULT_URL}/v1/sys/policy/${USER_TO_BE_CREATED}-policy --insecure -s -o /dev/null -w "%{http_code}")
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  CURL_RESPONSE=${CURL_RESPONSE}
  if [ "${CURL_RESPONSE}" != "204" ]; then
    echo "API call didn't return 204."
    exit 1
  fi
  rm ${POLICY_FILE}
  POLICY_FILE=$(mktemp).json
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute mktemp command."
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
  CURL_RESPONSE=$(curl \
    --header "X-Vault-Token: ${USER_TOKEN}" \
    --request POST \
    --data @${POLICY_FILE} \
    ${VAULT_URL}/v1/auth/${ORG}/users/${USER_TO_BE_CREATED} --insecure -s -o /dev/null -w "%{http_code}")
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  CURL_RESPONSE=${CURL_RESPONSE}
  if [ "${CURL_RESPONSE}" != "204" ]; then
    echo "API call didn't return 204."
    exit 1
  fi
  rm ${POLICY_FILE}
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to remove ${POLICY_FILE}."
    exit 1
  fi

  for config in "${!configs[@]}"; do echo "$config - ${configs[$config]}"; done

  echo "Login as the new user to add configuration files"
  USER_TOKEN=$(curl \
    --request POST \
    --data '{"password": "changeit"}' \
    ${VAULT_URL}/v1/auth/${ORG}/login/${USER_TO_BE_CREATED} --insecure)

  rc=$?
  if [ $rc -ne 0 ]; then
    echo "Failed to execute curl command."
    exit 1
  fi
  USER_TOKEN=${USER_TOKEN}
  USER_TOKEN=$(echo ${USER_TOKEN} | ${JQ} ".auth.client_token" | sed "s/\"//g")
  echo "USER_TOKEN is ${USER_TOKEN}"

  for config in "${!configs[@]}"; do
    signcerts=$(cat ${PWD}/../openidl-k8s/charts/openidl-secrets/config/${configs[$config]}.json)
    echo ${signcerts}

    JSON_DATA_PAYLOAD="{\"data\":${signcerts}}"

    echo "JSON_DATA_PAYLOAD=${JSON_DATA_PAYLOAD}"
    echo "Add data to vault for ORG=${ORG}, COMPONENT=${APP}"
    CURL_RESPONSE=$(curl \
      --header "X-Vault-Token: ${USER_TOKEN}" \
      --request POST \
      --data "${JSON_DATA_PAYLOAD}" \
      ${VAULT_URL}/v1/${ORG}/data/${APP}/${configs[$config]} --insecure -s -o /dev/null -w "%{http_code}")
    rc=$?
    if [ $rc -ne 0 ]; then
      echo "Failed to execute curl command."
      exit 1
    fi
    echo "CURL_RESPONSE=${CURL_RESPONSE}"
    if [ "${CURL_RESPONSE}" != "200" ]; then
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
  U)
    USER_TO_BE_CREATED=${OPTARG}
    ;;
  P)
    PASSWORD_TO_BE_CREATED=${OPTARG}
    ;;
  a)
    APP=${OPTARG}
    ;;
  o)
    ORG=${OPTARG}
    ;;
  e)
    PERMISSIONS=${OPTARG}
    ;;
  h)
    echo "update-vault.sh -H http://VAULT_HOST:VAULT_PORT -u VAULT_USER -p  VAULT_PASSWORD -f"
    exit 0
    ;;
  \?)
    echo "Unknown option. ${OPT}"
    ;;
  esac
done

checkInputs
run

exit 0
