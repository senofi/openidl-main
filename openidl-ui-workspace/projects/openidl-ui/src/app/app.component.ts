import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {AuthConfigService} from "../../../openidl-common-ui/src/lib/services/auth.config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Openidl app';
  API_ENDPOINT = environment.DATA_CALL_APP_URL;

  constructor(private oauthService: OAuthService, private authConfigService: AuthConfigService) {
    localStorage.setItem('API_ENDPOINT', JSON.stringify(this.API_ENDPOINT));
  }

  ngOnInit() {
    sessionStorage.removeItem('isModalOpen');
    this.authConfigService.loadConfig().then(result => {
      this.oauthService.configure(this.authConfigService.getAuthConfig());
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(e => {
        this.oauthService.setupAutomaticSilentRefresh();
      })
    })
  }

}
