module.exports.salts = [
    (inputRecord) => {
        if (inputRecord.substring(0, 2) !== '49') return inputRecord;
        let outputRecord = inputRecord.replace('\r', '').padEnd(344)
        let start = 169
        let end = 194
        let index = Math.floor(Math.random() * 3)
        let formEditions = ["BP 1234 0116             ", "BP 5678 0319             ", "BP 9012 0620             "]
        return outputRecord.substring(0, start) + formEditions[index] + outputRecord.substring(end)
    },
    (inputRecord) => {
        if (inputRecord.substring(0, 2) !== '47') return inputRecord;
        let outputRecord = inputRecord.replace('\r', '').padEnd(344)
        let start = 169
        let end = 194
        let index = Math.floor(Math.random() * 3)
        let formEditions = ["CP 1234 0116             ", "CP 5678 0319             ", "CP 9012 0620             "]
        return outputRecord.substring(0, start) + formEditions[index] + outputRecord.substring(end)
    },
    (inputRecord) => {
        if (inputRecord.substring(0, 2) !== '31') return inputRecord;
        let outputRecord = inputRecord.replace('\r', '').padEnd(344)
        let start = 169
        let end = 194
        let index = Math.floor(Math.random() * 3)
        let formEditions = ["IM 1234 0116             ", "IM 5678 0319             ", "IM 9012 0620             "]
        return outputRecord.substring(0, start) + formEditions[index] + outputRecord.substring(end)
    }
]
