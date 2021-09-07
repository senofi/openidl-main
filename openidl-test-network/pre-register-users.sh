#!/bin/bash
# export path
export PATH=${PWD}/bin:$PATH
export GODEBUG=x509ignoreCN=0

# delete wallet store
curl -X DELETE http://admin:adminpw@localhost:9984/wallet/

# create a wallet in couchdb
curl -X PUT http://admin:adminpw@localhost:9984/wallet

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/aais.example.com/

# enroll admin
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-aais --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem

# register user - openidl-aais-insurance-data-manager-ibp-2.0
fabric-ca-client register --caname ca-aais --id.name openidl-aais-insurance-data-manager-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-aais-insurance-data-manager-ibp-2.0:password@localhost:7054 --caname ca-aais -M ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-insurance-data-manager-ibp-2.0@aais.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/aais.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-insurance-data-manager-ibp-2.0@aais.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-insurance-data-manager-ibp-2.0@aais.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-insurance-data-manager-ibp-2.0@aais.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"aaismsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-insurance-data-manager-ibp-2.0" -d "$signcertsJSON"

# openidl-aais-data-call-app-ibp-2.0

# register user - openidl-aais-data-call-app-ibp-2.0
fabric-ca-client register --caname ca-aais --id.name openidl-aais-data-call-app-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-aais-data-call-app-ibp-2.0:password@localhost:7054 --caname ca-aais -M ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-app-ibp-2.0@aais.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/aais.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-app-ibp-2.0@aais.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-app-ibp-2.0@aais.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-app-ibp-2.0@aais.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"aaismsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-data-call-app-ibp-2.0" -d "$signcertsJSON"

# openidl-aais-data-call-processor-ibp-2.0

# register user - openidl-aais-data-call-processor-ibp-2.0
fabric-ca-client register --caname ca-aais --id.name openidl-aais-data-call-processor-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-aais-data-call-processor-ibp-2.0:password@localhost:7054 --caname ca-aais -M ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/aais.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"aaismsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-data-call-processor-ibp-2.0" -d "$signcertsJSON"

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/analytics.example.com/

# enroll admin
fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-analytics --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem

# openidl-analytics-data-call-app-ibp-2.0

# register user - openidl-analytics-data-call-app-ibp-2.0
fabric-ca-client register --caname ca-analytics --id.name openidl-analytics-data-call-app-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-analytics-data-call-app-ibp-2.0:password@localhost:8054 --caname ca-analytics -M ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-analytics-data-call-app-ibp-2.0@analytics.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/analytics.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-analytics-data-call-app-ibp-2.0@analytics.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-analytics-data-call-app-ibp-2.0@analytics.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-analytics-data-call-app-ibp-2.0@analytics.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"analyticsmsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-analytics-data-call-app-ibp-2.0" -d "$signcertsJSON"

# openidl-data-call-mood-listener-ibp-2.0

# register user - openidl-data-call-mood-listener-ibp-2.0
fabric-ca-client register --caname ca-analytics --id.name openidl-data-call-mood-listener-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-data-call-mood-listener-ibp-2.0:password@localhost:8054 --caname ca-analytics -M ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-data-call-mood-listener-ibp-2.0@analytics.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/analytics.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-data-call-mood-listener-ibp-2.0@analytics.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-data-call-mood-listener-ibp-2.0@analytics.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-data-call-mood-listener-ibp-2.0@analytics.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"analyticsmsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-data-call-mood-listener-ibp-2.0" -d "$signcertsJSON"


# openidl-transactional-data-event-listener-ibp-2.0

# register user - openidl-transactional-data-event-listener-ibp-2.0
fabric-ca-client register --caname ca-analytics --id.name openidl-transactional-data-event-listener-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-transactional-data-event-listener-ibp-2.0:password@localhost:8054 --caname ca-analytics -M ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-transactional-data-event-listener-ibp-2.0@analytics.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/analytics/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/analytics.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-transactional-data-event-listener-ibp-2.0@analytics.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-transactional-data-event-listener-ibp-2.0@analytics.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/analytics.example.com/users/openidl-transactional-data-event-listener-ibp-2.0@analytics.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"analyticsmsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-transactional-data-event-listener-ibp-2.0" -d "$signcertsJSON"

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/carrier.example.com/

# enroll admin
fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca-carrier --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem

# openidl-carrier-data-call-app-ibp-2.0

# register user - openidl-carrier-data-call-app-ibp-2.0
fabric-ca-client register --caname ca-carrier --id.name openidl-carrier-data-call-app-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-carrier-data-call-app-ibp-2.0:password@localhost:10054 --caname ca-carrier -M ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-app-ibp-2.0@carrier.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/carrier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-app-ibp-2.0@carrier.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-app-ibp-2.0@carrier.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-app-ibp-2.0@carrier.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"carriermsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-carrier-data-call-app-ibp-2.0" -d "$signcertsJSON"

# openidl-carrier-data-call-processor-ibp-2.0

# register user - openidl-carrier-data-call-processor-ibp-2.0
fabric-ca-client register --caname ca-carrier --id.name openidl-carrier-data-call-processor-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-carrier-data-call-processor-ibp-2.0:password@localhost:10054 --caname ca-carrier -M ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-processor-ibp-2.0@carrier.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/carrier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-processor-ibp-2.0@carrier.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-processor-ibp-2.0@carrier.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-data-call-processor-ibp-2.0@carrier.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"carriermsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-carrier-data-call-processor-ibp-2.0" -d "$signcertsJSON"

# openidl-carrier-insurance-data-manager-ibp-2.0

# register user - openidl-carrier-insurance-data-manager-ibp-2.0
fabric-ca-client register --caname ca-carrier --id.name openidl-carrier-insurance-data-manager-ibp-2.0 --id.secret password --id.type client --id.attrs 'orgType=advisory:ecert' --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-carrier-insurance-data-manager-ibp-2.0:password@localhost:10054 --caname ca-carrier -M ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-insurance-data-manager-ibp-2.0@carrier.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/carrier/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/carrier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-insurance-data-manager-ibp-2.0@carrier.example.com/msp/config.yaml

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-insurance-data-manager-ibp-2.0@carrier.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\\\n}"
privKey=$(cat ${PWD}/organizations/peerOrganizations/carrier.example.com/users/openidl-carrier-insurance-data-manager-ibp-2.0@carrier.example.com/msp/keystore/*)
signingPrivKey="${privKey//$'\n'/\\\\r\\\\n}"
initCommand='"{\"credentials\":{\"certificate\":\"signcerts\\n\",\"privateKey\":\"privatekey\\r\\n\"},\"mspId\":\"carriermsp\",\"type\":\"X.509\",\"version\":1}"'
data="${initCommand/signcerts/$signingIdentity}"
data="${data/privatekey/$signingPrivKey}"
signcertsJSON="{\"data\":$data}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-carrier-insurance-data-manager-ibp-2.0" -d "$signcertsJSON"
