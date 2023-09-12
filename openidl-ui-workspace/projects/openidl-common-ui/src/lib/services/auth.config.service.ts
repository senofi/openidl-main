import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthConfig} from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthConfigService {
  private config: AuthConfig;

  constructor(private http: HttpClient) {
    console.log('AuthConfigService constructor');
  }

  static initConfig(configService: AuthConfigService) {
    return () => configService.loadConfig();
  }

  loadConfig(): Promise<AuthConfig> {
    console.log('Loading auth config');
    return this.http
    .get('/api/auth-config')
    .toPromise()
    .then((config) => {
      console.log('Loaded auth config', config)
      this.config = config;
      console.log('Loaded auth config 2', config)
      return config;
    });
  }

  getAuthConfig(): AuthConfig {
    console.log('Getting auth config', this.config)
    if (!this.config) {
      throw Error('Config has not been loaded yet.');
    }
    return {
      ...this.config,
      redirectUri: window.location.origin + '/datacallList',
      responseType: 'code',
      scope: 'openid phone email',
      // showDebugInformation: true,
      skipIssuerCheck: true,
      strictDiscoveryDocumentValidation: false,
    };
  }
}
