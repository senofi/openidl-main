# Pull the images
./bootstrap.sh 2.2.3 1.5.0

# bring down the current network
./network.sh down

# bring up the network
./network.sh up -ca -s couchdb

# create the defaultchannel
./network.sh createChannel -c defaultchannel -p DefaultChannel

# create the analytics-aais
./network.sh createChannel -c analytics-aais -p AnalyticsAaisChannel

# create the analytics-carrier
./network.sh createChannel -c analytics-carrier -p AnalyticsCarrierChannel

# deploy the chaincode to all the peers
./network.sh deployCC -c defaultchannel -ccn openidl-cc-default -ccp ../openidl-chaincode/chaincode/openidl -ccl go

# Pre-register users on certificate authority
./pre-register-users.sh