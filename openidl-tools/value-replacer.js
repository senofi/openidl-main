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
    // console.log('processing folder: ' + folder)
    // console.log(' replacing: ', JSON.stringify(replacements))
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
    // console.log(' processing file: ' + file)
    let result = fs.readFileSync(file, 'utf8')
    for (replacement of replacements) {
        let replacementString = '${' + replacement.name + '}'
        // console.log('  replacing: ' + replacement.name + ' with ' + replacement.value)
        do {
            let replacingString = replacement.value
            if (replacement.handleEndOfLine) {
                // console.log('   handling end of line')
                replacingString = replacingString.replace(/\n/g, '\\n')
            }
            result = result.replace(replacementString, replacingString);
        } while (result.indexOf(replacementString) > -1)
    }

    fs.writeFileSync(file, result, 'utf8');
}

exports.replaceVariablesInFile = replaceVariablesInFile
exports.replaceVariablesInFolder = replaceVariablesInFolder