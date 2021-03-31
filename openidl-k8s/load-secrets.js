/**
 * Load the secrets from aws.
 * call via node load-secrets.js <cloud> <environment> <node>
 * The results will be placed into the config directory.
 */
const secretsManager = require('../openidl-secrets-manager/secrets-manager')

var args = process.argv.slice(2)
if (args.length !== 3) {
    console.log('Error.  Must provide 3 parguments: cloud, environment, node.')
    console.log("Usage: node index.js <cloud> <environment> <node>")
    exit(1)
} else {
    secretsManager.loadSecretsFromCloud('./charts/openidl-secrets/config', args[0], args[1], args[2])
}