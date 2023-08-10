const k8s = require('@kubernetes/client-node');
const config = require('config');
const AbstractSecretsClient = require('./abstract-secrets-client');

class KubernetesSecretsClient extends AbstractSecretsClient {
    constructor() {
        super();
        this.client = k8s.Config.defaultClient();
    }

    async getSecret(name) {
        const secret = await this.client.readNamespacedSecret(name.toLowerCase(), config.get('namespace') || 'default');
        const body = secret.body;
        const data = body.data;
        const result = {}
        for (let key in data) {
            result[key] = Buffer.from(data[key], 'base64').toString('utf-8');
        }
        return result;
    }
}

module.exports = KubernetesSecretsClient;