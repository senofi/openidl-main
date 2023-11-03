import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {OAuthService} from "angular-oauth2-oidc";
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AuthConfigService} from "../../../openidl-common-ui/src/lib/services/auth.config.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Openidl app';
  API_ENDPOINT = environment.DATA_CALL_CARRIER_APP_URL;

  constructor(private oauthService: OAuthService, private authConfigService: AuthConfigService) {
    localStorage.setItem('API_ENDPOINT', JSON.stringify(this.API_ENDPOINT));
  }

  async ngOnInit() {
    sessionStorage.removeItem('isModalOpen');

    await this.authConfigService.loadConfig().then(async result => {
      const config = this.authConfigService.getAuthConfig();
      this.oauthService.configure({
        ...config,
        responseType: 'code',
        tokenEndpoint: config.token_endpoint,
        userinfoEndpoint: config.userinfo_endpoint,
        loginUrl: config.authorization_endpoint,
        logoutUrl: window.location.origin + '/login',

      });
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      await this.oauthService.tryLogin().then(async loggedIn => {
        this.oauthService.setupAutomaticSilentRefresh();
      })
    })
  }
}
