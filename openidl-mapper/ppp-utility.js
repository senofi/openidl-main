const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const parser = require('parse-address')

module.exports.extractAddress = function extractAddress(line) {
    let addressText = line.substring(194, 355)
    return parser.parseLocation(addressText)
}

module.exports.saltLine = function saltLine(line, newCode) {
    // console.log(`Salting with ${newCode}`)
    return line + newCode
}

/**
 * Search for the address in the ppp index
 * @param {} client 
 * @param {*} address 
 */
module.exports.searchByAddress = async function searchByAddress(client, address) {
    if (!address) return {}
    let searchAddress = `${address.number}${address.prefix ? ' ' + address.prefix : ''} ${address.street} ${address.type ? address.type : ''}`
    // console.log(`searching for ${searchAddress} ${JSON.stringify(address)}`)
    let searchCity = address.city
    let searchState = address.state
    let searchZip = address.zip
    let searchConfig = {
        index: 'ppp-data',
        default_operator: 'AND',
        size: 1,
        _source: ['BorrowerAddress', 'BorrowerState', 'BorrowerCity', 'BorrowerZip', 'NAICSCode', 'CurrentApprovalAmount', 'LoanNumber'],
        body: {
            query: {
                match: {
                    BorrowerAddress: searchAddress
                }
            }
        }
    }

    const { body } = await client.search({
        index: 'ppp-data',
        body: {
            query: {
                match: {
                    "BorrowerAddress": searchAddress
                }
            },
            _source: false,
            fields: [
                "BorrowerName",
                "BorrowerAddress",
                "BorrowerCity",
                "BorrowerState",
                "BorrowerZip",
                "NAICSCode",
                "LoanStatus",
                "CurrentApprovalAmount"
            ]
        }
    }
    ) //.then((body) => { console.log(JSON.stringify(body)) }).catch((err) => { console.log(err) })

    // const { body: count } = await client.count({ index: 'tweets' })
    // console.log(count)
    // console.log('Done searching data.  Response ' + JSON.stringify(body.hits.hits))
    for (hit of body.hits.hits) {
        if (hit.fields.BorrowerCity[0] === address.city && hit.fields.BorrowerState[0] === address.state && hit.fields.BorrowerZip[0].substring(0, 5) === address.zip.substring(0, 5)) {
            return hit
        }
    }
    return {}
}

