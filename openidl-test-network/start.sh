# bring down the current network
./network.sh down

# Pull the images
./bootstrap.sh 2.2.3 1.5.1

# bring up the network
./network.sh up -ca -s couchdb

# create the defaultchannel
./network.sh createChannel -c defaultchannel -p DefaultChannel

# create the analytics-aais
./network.sh createChannel -c analytics-aais -p AnalyticsAaisChannel

# create the analytics-carrier
./network.sh createChannel -c analytics-carrier -p AnalyticsCarrierChannel

# package and install 'openidl-cc-default' chaincode on aais node
./network.sh deployCC -ccn openidl-cc-default -ccp ../openidl-chaincode/chaincode/openidl -ccl go -ccsd true

# package and install 'openidl-cc-aais-carriers' chaincode on aais, analytics and carrier nodes 
./network.sh deployCC -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -ccsd true

# deploy 'openidl-cc-default' chaincode on 'defaultchannel'
./network.sh deployCC -c defaultchannel -ccn openidl-cc-default -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true

# deploy 'openidl-cc-aais-carriers' chaincode on 'analytics-aais'
./network.sh deployCC -c analytics-aais -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true -cccg ../openidl-chaincode/chaincode/openidl/collection-config-analytics-aais.json

# deploy 'openidl-cc-aais-carriers' chaincode on 'analytics-carrier'
./network.sh deployCC -c analytics-carrier -ccn openidl-cc-aais-carriers -ccp ../openidl-chaincode/chaincode/openidl -ccl go -cci Init -ccsp true -cccg ../openidl-chaincode/chaincode/openidl/collection-config-analytics-carrier.json

# pre-register users on certificate authority
./pre-register-users.sh
