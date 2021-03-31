# Backlog for openIDL open sourcing
| Item | Description | Details |
| ---- | ----------- | ------- |
| sendgrid key must be removed from source | the sendgrid api key was in clear text.  This must be incorporated into the IaC so that it gets set properly.  Currently residing in the AWS secret manager in the /openidl/ibm/any/any secret | This is found in the insurance-data-manager and in the common-lib |
