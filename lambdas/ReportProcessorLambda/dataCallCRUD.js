const fetch = require('node-fetch');
const fs = require('fs')
const config = require('./config/datacall-config.json')


async function login(baseURL, username, password) {
    console.log("Inside login")
    console.log("baseURL: ", baseURL)
    console.log("user: ", username)
    console.log("pass: ", password)
    try {
        // console.log("About to send fetch from " + fullUrl)
        let response = await fetch(baseURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "username": username, "password": password }),
        });
        // console.log("Back from fetch")
        if (response.status !== 200) {
            console.log(response)
            if (response.status !== 504) {
                process.exit(0)
            }
        }
        result = await response.json()
        let userToken = result.result.userToken
        return userToken
    } catch (error) {
        console.log("Error with login " + error);
        return;
    }
}
async function callAPI(apiUrl, method, payload, token) {
    try {
        console.log("Calling API with URL: ", apiUrl)
				const apiFields = {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            }
        }
				if (method != "GET" && payload != "") {
					apiFields.body = payload;
				}
        let response = await fetch(apiUrl, apiFields);
				const data = await response.json();
        if (response.status !== 200) {
					console.log("Error! ", response.status)
						return data;
					}
				return data
    } catch (error) {
        console.log("Error  " + error);
        return;
    }
}

module.exports.getDatacall = async function (datacallId) {
    console.log("Inside getDatacall")
    let URL = config.loginURL 
    console.log(`Logging in`)
    let userToken = await login(URL, config.username, config.password)
		payload = "";
		URL = config.getDatacallURL + datacallId
    const datacall = await callAPI(URL, "GET", payload, userToken);
		return datacall;
}

module.exports.updateDatacall = async function (datacall) {
    console.log("Inside updateDatacall")
    let URL = config.loginURL 
    console.log(`Logging in`)
    let userToken = await login(URL, config.username, config.password)
		payload = datacall;
		URL = config.updateDatacallURL
    await callAPI(URL, "PUT", payload, userToken)
}