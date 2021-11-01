// this routine must be passed a json object containing the values to be replaced.
// the format of the file is:
/*
[
    {
        "name": "<value>"
    }    
]
*/

const fs = require('fs');
const path = require('path')

function replaceVariablesInFolder(folder, replacements) {
    fs.readdirSync(folder).forEach(file => {
        let absolute = path.join(folder, file)
        if (fs.statSync(absolute).isDirectory()) {
            return replaceVariablesInFolder(absolute, replacements)
        } else {
            return replaceVariablesInFile(absolute, replacements)
        }
    })

}

function replaceVariablesInFile(file, replacements) {
    let result = fs.readFileSync(file, 'utf8')
    for (replacement of replacements) {
        result = result.replace('${' + replacement.name + '}', replacement.value);
    }

    fs.writeFileSync(file, result, 'utf8');
}

exports.replaceVariablesInFile = replaceVariablesInFile
exports.replaceVariablesInFolder = replaceVariablesInFolder