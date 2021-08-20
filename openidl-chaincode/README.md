# openIDL chaincode

This repository contains one smart contract (aka chaincode) component for the openIDL network:
* `openIDLCC` - This chaincode component is installed and instantiated in the network. Please see the test-network documentation for more details.

Please note that the `openIDLCC` chaincode component is implemented in the [GO](https://golang.org/) language.

## Key Entities
The following are the main entities (aka structures) defined in the `openIDLCC` chaincode component:

1. DataCall.
1. Report 
1. Like
1. Consent

## Compiling and running test cases locally
Note: This is not working at this moment.
### Platform
It is strongly recommended to use **macOS** or a **Linux** flavor (such as Ubuntu) for compiling and testing the chaincode components. 

### Prerequisites
1) Before you attempt to compile and run the tests cases for the chaincode components, please make sure you have the necessary pre-requisites on your system:

* GO programming language (v1.16.x)
* Python (v2.7)

2) Finally, you'll also need to download the following assert library before proceeding with steps in the next section:

```
go get github.com/stretchr/testify/assert
```

### Steps

1) You should clone this repository into the `src` folder of your `GOPATH` folder (it is assumed you have configured your GO development environment and the `GOPATH` environment variable is set accordingly).

2) Navigate to the folder where you cloned this repository and go to the `chaincode/openidl` sub-folder.

3) Once in the `chaincode/openidl` sub-folder, let's run `go build` to compile the chaincode (please note there will not be any output message if compilation was successful:

```
$ pwd
$GOPATH/src/openidl-chaincode/chaincode/openidl
$ go build
```

After compiling the chaincode, you should see an executable file named `openidl` in the `chaincode/openidl` sub-folder.

4) To run the automated test cases for the chaincode, execute `go test` in the `chaincode/openidl` sub-folder. All tests should succeed; you should see a `PASS ok` message near the end of the output, similar to the following:

```
$ go test
Test_CreateConsent_Should_Create_A_Consent_When_Consent_Does_Not_Exist
2018-12-05 08:39:25.317 EST [openIDLCC_Logger] Info -> INFO 001 ListConsentsByDataCall: Key  [Consent_Key_ Data_Call_123 1]
2018-12-05 08:39:25.317 EST [mock] HasNext -> ERRO 002 HasNext() couldn't get Current
2018-12-05 08:39:25.317 EST [openIDLCC_Logger] Info -> INFO 003 ListConsentsByDataCall: Likes fetched for current channel, moving on to other channels
2018-12-05 08:39:25.317 EST [openIDLCC_Logger] Info -> INFO 004 InvokeChaincodeOnChannel: currentChannelID >  aais-carriers
2018-12-05 08:39:25.317 EST [openIDLCC_Logger] Info -> INFO 005 ListConsentsByDataCall: Key  [Consent_Key_ Data_Call_123 1]
2018-12-05 08:39:25.318 EST [mock] HasNext -> ERRO 006 HasNext() couldn't get Current
2018-12-05 08:39:25.318 EST [mock] HasNext -> ERRO 007 HasNext() couldn't get Current
2018-12-05 08:39:25.318 EST [openIDLCC_Logger] Info -> INFO 008 ListConsentsByDataCall: No Consent found on current channel, proceed to next channel 
2018-12-05 08:39:25.318 EST [openIDLCC_Logger] Info -> INFO 009 InvokeChaincodeOnChannel: currentChannelID >  aais-carrier1

...

Test_ListReportsByCriteria_Should_Return_List_Of_Reports
2018-12-05 08:39:25.323 EST [openIDLCC_Logger] Error -> ERRO 05d DataCallID is empty!!
err_message_getDataCallVersions > ListReportsByCriteria: failed to get list of Reports: not implementedPASS
ok  	_/Users/olivieri/git/openIDL-release2/openidl-chaincode/chaincode/openidl	0.060s
```
