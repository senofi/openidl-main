import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_5SnnPA7VB',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin  + '/datacallList',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '7njgj8f63v07p6e7t650sd19uh',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid phone email',

  showDebugInformation: true,
  skipIssuerCheck: true,
  // tokenEndpoint: 'https://openidl-lyubo-test.auth.eu-central-1.amazoncognito.com/oauth2/token',
  // userinfoEndpoint: 'https://openidl-lyubo-test.auth.eu-central-1.amazoncognito.com/oauth2/userInfo',
  // logoutUrl: 'https://openidl-lyubo-test.auth.eu-central-1.amazoncognito.com/logout?client_id=6ca8g2n948n9jqdqdl4775ctoh&logout_uri=' + encodeURIComponent(window.location.origin + '/index.html'),
  strictDiscoveryDocumentValidation: false,
};
