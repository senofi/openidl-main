const rp = require('request-promise');
const idpCredentials = JSON.parse(process.env.IDP_CONFIG);

const getJwksConfig = async (url) => {
  return rp(url)
}

module.exports = (req, res) => {
  rp(`${idpCredentials.issuer}/.well-known/openid-configuration`)
  .then( async (response) => {
    const parsedOpenidConfig = JSON.parse(response)
    const jwksConfig = await getJwksConfig(parsedOpenidConfig.jwks_uri)
    res.json({
      issuer: idpCredentials.issuer,
      clientId: idpCredentials.clientId,
      ...parsedOpenidConfig,
      jwks: JSON.parse(jwksConfig)
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500)
    .json({
      message: 'Error occurred while fetching auth configuration. Error' + err
    });
  });
};
