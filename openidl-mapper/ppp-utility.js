const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const parser = require('parse-address')

module.exports.isPrem = function isPrem(line) {
    let transactionCode = line.substring(19, 20)
    return transactionCode === '1' || transactionCode === '8' || transactionCode === '9'
}

module.exports.extractAddress = function extractAddress(line) {
    let addressText = line.substring(194, 355)
    return parser.parseLocation(addressText)
}

module.exports.saltLine = function saltLine(line, newCode) {
    let salted = line.replace('\n', '').replace('\r', '') + newCode
    return salted
}

module.exports.getPolicyNumber = function getPolicyNumber(line) {
    return line.substring(128, 136)
}

module.exports.getClaimNumber = function getClaimNumber(line) {
    return line.substring(126, 133)
}

module.exports.getClaimAddress = async function getClaimAddress(client, claimNumber) {
    let { body } = await client.search({
        index: 'trv-claim-address', body: { "query": { "match": { "CLAIM_NUMBER": claimNumber } } }
    })
    if (body.hits.hits.length > 0) {
        let hit = body.hits.hits[0]
        return { "address": hit._source.ADDRESS, "city": hit._source.CITY, "state": hit._source.STATE, "zip": hit._source.ZIP }
    }
    return {}
}

module.exports.getPolicyAddress = async function getPolicyAddress(client, policyNumber) {
    let { body } = await client.search({
        index: 'trv-policy-addresses', body: { "query": { "match": { "POL_NBR": '00' + policyNumber } } }
    })
    if (body.hits.hits.length > 0) {
        let hit = body.hits.hits[0]
        return { "address": hit._source.NI_ADDR_LN_1_TXT, "city": hit._source.NI_CTY_NM, "state": hit._source.NI_ST_CD, "zip": hit._source.NI_PST_LOC_CD }
    }
    return {}
}

module.exports.searchByAddress = async function searchyByAddress(client, address) {
    let searchAddress = { address: `${address.number}${address.prefix ? ' ' + address.prefix : ''} ${address.street} ${address.type ? address.type : ''}`, city: address.city, state: address.state, zip: address.zip }
    return await this.searchByAddressSimple(client, searchAddress)
}

/**
 * Search for the address in the ppp index
 * @param {} client 
 * @param {*} address 
 */
module.exports.searchByAddressSimple = async function searchByAddressSimple(client, address) {
    if (!address) return {}
    let searchAddress = address.address
    // console.log(`searching for ${searchAddress} ${JSON.stringify(address)}`)
    let searchCity = address.city
    let searchState = address.state
    let searchZip = address.zip
    let searchConfig = {
        index: 'ppp-data',
        default_operator: 'AND',
        size: 1,
        _source: ['BorrowerAddress', 'BorrowerState', 'BorrowerCity', 'BorrowerZip', 'NAICSCode', 'CurrentApprovalAmount', 'LoanNumber', 'JobsReported', 'ProcessingMethod', 'RuralUrbanIndicator', 'CD', 'Race'],
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
                "InitialApprovalAmount",
                "CurrentApprovalAmount",
                "LoanNumber",
                "JobsReported",
                "ProcessingMethod",
                "RuralUrbanIndicator",
                "CD",
                "Race"
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

/**
 * Search for the address in the ppp index
 * @param {} client 
 * @param {*} address 
 */
module.exports.searchByState = async function searchByState(client, state, max) {
    if (!state) return {}

    const { body } = await client.search({
        index: 'ppp-data',
        body: {
            size: max,
            query: {
                match: {
                    "BorrowerState": state
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
                "InitialApprovalAmount",
                "CurrentApprovalAmount",
                "LoanNumber",
                "JobsReported",
                "ProcessingMethod",
                "RuralUrbanIndicator",
                "CD",
                "Race"
            ]
        }
    }
    )

    return body.hits.hits
}
