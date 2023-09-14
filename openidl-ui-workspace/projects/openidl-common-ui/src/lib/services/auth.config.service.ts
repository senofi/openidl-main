import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthConfig} from 'angular-oauth2-oidc';

interface ExtendedAuthConfig extends AuthConfig {
  scopes_supported: string[];
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  authorization_endpoint: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthConfigService {
  private config: ExtendedAuthConfig;

  constructor(private http: HttpClient) {
    console.log('AuthConfigService constructor');
  }

  static initConfig(configService: AuthConfigService) {
    return () => configService.loadConfig();
  }

  loadConfig(): Promise<ExtendedAuthConfig> {
    console.log('Loading auth config');
    return this.http
    .get('/api/auth-config')
    .toPromise()
    .then((config: ExtendedAuthConfig) => {
      console.log('Loaded auth config', config)
      this.config = config;
      console.log('Loaded auth config 2', config)
      return config;
    });
  }

  getAuthConfig(): ExtendedAuthConfig {
    console.log('Getting auth config', this.config)
    if (!this.config) {
      throw Error('Config has not been loaded yet.');
    }
    return {
      ...this.config,
      redirectUri: window.location.origin + '/auth-callback',
      responseType: 'code',
      scope: 'openid phone email',
      // showDebugInformation: true,
      skipIssuerCheck: true,
      strictDiscoveryDocumentValidation: false,
    };
  }
}
