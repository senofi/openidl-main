import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from './auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Openidl app';
  API_ENDPOINT = environment.DATA_CALL_APP_URL;

  constructor(private oauthService: OAuthService) {
    localStorage.setItem('API_ENDPOINT', JSON.stringify(this.API_ENDPOINT));
  }

  ngOnInit() {
    sessionStorage.removeItem('isModalOpen');
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(e => {
      this.oauthService.tryLoginCodeFlow().then(e => {
        console.log('Logged in');
      }).catch(err => {
        console.log('Error while login');
      });
    })

  }

}
