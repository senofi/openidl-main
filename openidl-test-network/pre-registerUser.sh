# export path
export PATH=${PWD}/bin:$PATH
export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/aais.example.com/

# register user
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-aais --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem
fabric-ca-client register --caname ca-aais --id.name openidl-aais-data-call-processor-ibp-2.0 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem

# enroll user
fabric-ca-client enroll -u https://openidl-aais-data-call-processor-ibp-2.0:user1pw@localhost:7054 --caname ca-aais -M ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/aais/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/aais.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/config.yaml

# create a wallet in couchdb
curl -X PUT http://admin:adminpw@localhost:9984/wallet

# export public key to couchdb
pubKey=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/IssuerRevocationPublicKey)
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-insurance-data-manager-ibp-2.0-pub" -d "{\"member\":\"${pubKey//$'\n'/\\n}\"}"

# export priv key to couchdb
privKey=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/keystore/*)
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-insurance-data-manager-ibp-2.0-priv" -d "{\"member\":\"${privKey//$'\n'/\\n}\"}"

# export signcerts to couchdb
signcerts=$(cat ${PWD}/organizations/peerOrganizations/aais.example.com/users/openidl-aais-data-call-processor-ibp-2.0@aais.example.com/msp/signcerts/cert.pem)
signingIdentity="${signcerts//$'\n'/\\n}"
initCommand='"{\"name\":\"openidl-aais-data-call-processor-ibp-2.0\",\"mspid\":\"aaismsp\",\"roles\":null,\"affiliation\":\"\",\"enrollmentSecret\":\"\",\"enrollment\":{\"signingIdentity\":\"openidl-aais-data-call-processor-ibp-2.0\",\"identity\":{\"certificate\":\"signcerts\"}}}"'
member="${initCommand/signcerts/$signingIdentity}"
signcertsJSON="{\"member\":$member}"
curl -X PUT http://admin:adminpw@localhost:9984/wallet/"openidl-aais-insurance-data-manager-ibp-2.0" -d "$signcertsJSON"