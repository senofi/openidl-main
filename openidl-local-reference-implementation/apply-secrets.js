// this routine uses the config/config-secrets.json to replace the variables in the files as they are copied

const fs = require('fs');
const path = require('path')
const secrets = require('./config/config-secrets.json')

function replaceSecretsInFolder(folder) {
    fs.readdirSync(folder).forEach(file => {
        let absolute = path.join(folder, file)
        if (fs.statSync(absolute).isDirectory()) {
            return replaceSecretsInFolder(absolute)
        } else {
            return replaceSecrets(absolute)
        }
    })

}

function replaceSecrets(file) {
    let result = fs.readFileSync(file, 'utf8')
    for (secret of secrets) {
        result = result.replace('${' + secret.name + '}', secret.value);
    }

    fs.writeFileSync(file, result, 'utf8');
}

replaceSecretsInFolder('../openidl-k8s/charts/openidl-secrets/')
