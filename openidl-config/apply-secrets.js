const valueReplacer = require('../openidl-tools/value-replacer')
const secrets = require('./aais-dev-config-secrets.json')

valueReplacer.replaceVariablesInFolder('./config/', secrets)
