# Backlog for openIDL open sourcing
| Item | Description |
| sendgrid key must be removed from soure | the sendgrid api key was in clear text.  This must be incorporated into the IaC so that it gets set properly.  Currently residing in the AWS secret manager in the /openidl/ibm/any/any secret
