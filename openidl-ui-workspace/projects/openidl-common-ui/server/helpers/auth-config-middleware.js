const rp = require('request-promise');
const idpCredentials = JSON.parse(process.env.IDP_CONFIG);

module.exports = (req, res) => {
  rp(`${idpCredentials.issuer}/.well-known/openid-configuration`)
  .then((response) => {
    res.json({
      issuer: idpCredentials.issuer,
      clientId: idpCredentials.clientId,
      ...JSON.parse(response)
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
