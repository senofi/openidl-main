/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 

var apihandler = require('../middlewares/apihandler');
var moment = require('moment');
const util = require('../helpers/util');

const idmAgent = {};

idmAgent.runDataLoad = async (req, res) => {

    //console.log(req.body);
    var msg = req.body.payload;
    var noOfRuns = req.body.noOfRuns;
    var token = req.headers.authorization;
    //console.log("msg is ", msg);
    console.log("The number of runs is ", noOfRuns);
    var start_date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log("The start time is ", start_date)
    for (let i = 0; i < noOfRuns; i++) {
        var j = 0;
        msg.chunkId = "Chunk_" + i;
    await apihandler.Methods.invoke(msg,token,
        function (invokeData) {
             console.log("Run " + i + " end time is " + new Date()); 
             j++;
             if(j == noOfRuns){
                var end_date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var duration = moment.duration(end_date.diff(start_date));
                var timeTaken = duration.asSeconds();     
                console.log("The time taken is ", timeTaken)
             }

            });

        }
        let jsonRes;
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'REQUEST TAKEN FOR INSURANCE DATA LOAD'
        };
        util.sendResponse(res, jsonRes);
    }
idmAgent.runDataLoadFromFile = async (req, res) => {

    //console.log(req.body);
    var noOfRuns = req.body.noOfRuns;
    var noOfRecords = req.body.noOfRecords;
    console.log("Inserting " + noOfRecords + " and running " + noOfRuns + " times")
    var token = req.headers.authorization;

    var record = {"batchId": "12345678","chunkId":"123", "sequenceNum": 1,"agrmnt":{"bsnssActvty":{"enmTyp":"SIC Code","indstryCd":"5651","nm":"Family Clothing Stores"},"cmmerclAgrmnt":{"enmTyp":"Policy Number","nm":"BOP1234       "},"fnclSrvcsAgrmntGrp":{"enmTyp":"","extrnlRfrnc":"","nm":""},"gnrcMnyPrvsn":{"mnyPrvsnDtrmnr":[{"enmTyp":"","extrnlRfrnc":"","nm":""}]},"indvdlAgrmnt":{"cnsntToRt":"","enmTyp":"","nm":"","sttExcptns":""},"othrCtgry":{"enmTyp":"Number of Employees","extrnlRfrnc":"","mxmmSz":"10000","nm":""},"othrRgstrtn":[{"enmTyp":"Tax ID","extrnlRfrnc":"165173071","nm":"Commercial Multiple Peril (Liability portion)"}],"plc":{"addrss":"123 First St, Chicago, IL 60007"},"prdctGrp":{"enmTyp":"Line of Insurance","extrnlRfrnc":"49","nm":"Businessowners"},"prlCtgry":{"awyFrmPrmssThftPrtctnTyp":"","enmTyp":"","extrnlRfrnc":"","gnrcMnyPrvsn":{"mnyPrvsnDtrmnr":[{"enmTyp":"","extrnlRfrnc":"","nm":""}]},"nm":"","wndHlCvrgSttsTyp":""},"prtclrMnyPrvsn":{"mnyPrvsnCshFlw":{"mnyPrvsnPrt":{"accntSttmnt":{"prdStrtDt":"04/2012"},"amnt":"74.0","enmTyp":"Premium Amount","fnnclTrnsctn":{"enmTyp":"Premium statistical transaction type","extrnlRfrnc":"1","nm":"Premium or Cancellation"}}}},"stndrdTxtSpcfctn":{"cmpstTxtBlck":{"plcyCvrgs":[{"cvrgFlg":"N","enmTyp":"Viral Exclusion Coverage"}],"plcyFrmEdtn":"BP 1234 0116"}},"strctrlCmpnnt":{"LdLbltyExclsnSttsTyp":"","cvrgCmpnnt":{"assssmntRslt":{"plcAssssmnt":{"enmTyp":"","extrnlRfrnc":"","nm":"","stndrdsClssfctn":""}},"enmTyp":"","expsrAmnt":"1","extrnlRfrnc":"","gnrcMnyPrvsn":{"mnyPrvsnDtrmnr":[{"amnt":"","enmTyp":"","extrnlRfrnc":""}]},"nm":"","physclObjct":{"strctr":{"cnstrctnTyp":"","dsgnStyl":"","enmTyp":"","extrnlRfrnc":"","nm":"","occpncyTyp":"","prdStrtDt":"","prtctnClss":""}},"prtclrMnyPrvsn":{"mnyPrvsnCshFlw":{"mnyPrvsnPrt":{"accntSttmnt":{"prdStrtDt":""},"amnt":"","enmTyp":"","extrnlRfrnc":"","fnnclTrnsctn":{"enmTyp":"","extrnlRfrnc":"","nm":""},"nm":""}}},"rskExpsr":{"enmTyp":"Class Code","extrnlRfrnc":"30042","nm":"Retail Stores: Computer & Software","sttlmntMthd":""}},"hrrcnExclsnEndrsmntSttsTyp":"","physclObjct":{"strctr":{"cnstrctnDt":"","cnstrctnYrBnd":"","inspctnFlg":"","ldLbltyIntrmCntrlLttr":"","ldLbltyUntCnt":"","ldPsnngLbltyStts":"","rfCvrngCttgry":"","rfDckAttchmntTyp":"","rfDckIntrnlPrssrDsgnTyp":"","rfDckMtrl":"","rfDckMxmmWndSpd":"","rfShpTyp":"","rfToWllAttchmntTyp":"","rnvtnDt":"","scndryLssMtgtnBldngFtrTyp":"","scndryWtrRsstncRfIndctr":"","strmShttrsPrsnt":"","wndBrnDbrsIndctr":"","wndLssMtgtnFtrTyp":"","wndRsstncOpnngPrtctn":"","wndstrmPrtctvDvc":""}},"plc":{"ggrphcArea":{"abbrvtn":"WI","enmTyp":"State Code","extrnlRfrnc":"48","postalCode":"53149","rgn":"Wisconsin","sbRgn":""}},"stndrdTxtSpcfctn":{"cmpstTxtBlck":{"enmTyp":"Policy Form","extrnlRfrnc":"15","nm":"Special form with theft"}},"wrpArndEndrsmntSttsIndctr":""}},"clm":{"clmFldr":[{"elmntryClm":[{"clmOffr":[{"enmTyp":"","extrnlRfrnc":"","nm":"","pymnt":{"amnt":"","enmTyp":""},"sttlmntMthd":""}],"enmType":"","evnt":[{"csoflss":[{"ctgry":"","enmTyp":"","extrnlRfrnc":""}],"lssEvntCtgry":""}],"nm":"","prtclrMnyPrvsn":[{"mnyPrvsnCshFlw":[{"mnyPrvsnPrt":[{"accntSttmnt":{"prdStrtDt":""},"amnt":"","clmsCnt":"","enmTyp":"","fnnclTrnsctn":{"enmTyp":"","extrnlRfrnc":"","nm":""}}]}]}]}],"enmTyp":"","evnt":[{"strtDt":""}],"nm":"","stts":""}]},"errrFlg":false,"errrLst":[],"extrnlRfrnc":"","carrierId":"4809","uuid":"b2fa95dd-932c-4a6c-b6f2-e712d192d86b","policyNo":"","batchHash":"1c7c02a74dc1b6c5dfcc5ce547c15554d3d73760c45f06e961f0e4889734e365","docID":"b2fa95dd-932c-4a6c-b6f2-e712d192d86b","batchId":"bop_prem_loss_test.txt","documentId":"4809-bop_prem_loss_test.txt-d7b67920-accb-11ea-9b8f-cb44f4f80b71"};
    //console.log("msg is ", msg);
    
    var start_date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log("The start time is ", start_date)
    for (let i = 0; i < noOfRuns; i++) {
        var j = 0;
        var ts = Date.now();
        

        var arrRecords = [];
        for(let k=0; k < noOfRecords; k++){
            record.batchId = "Batch_" + ts + "_" + i;
            record.chunkId = "Chunk_" + ts + "_" + i;
            arrRecords.push(record);
        }
        var msg = {
            "batchId":"Batch_" + ts + "_" + i,
            "chunkId":"Chunk_" + ts + "_" + i,
            "carrierId" : "6964",
            "records" : arrRecords
        }
    
    await apihandler.Methods.invoke(msg,token,
        function (invokeData) {
             console.log("Run " + i + " end time is " + new Date()); 
             j++;
             if(j == noOfRuns){
                var end_date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var duration = moment.duration(end_date.diff(start_date));
                var timeTaken = duration.asSeconds();     
                console.log("The time taken is ", timeTaken)
             }

            });

        }
        let jsonRes;
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'REQUEST TAKEN FOR INSURANCE DATA LOAD'
        };
        util.sendResponse(res, jsonRes);
}

    module.exports = idmAgent;