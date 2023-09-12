const idpCredentials = JSON.parse(process.env.IDP_CONFIG);

module.exports =  (req, res) => {
  console.log(idpCredentials)
  res.json({
    issuer: idpCredentials.issuer,
    clientId: idpCredentials.clientId,
  });
}
