import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {OAuthService} from "angular-oauth2-oidc";

type UserAttributes = {
  role: string;
  organizationId: string;
  username: string;
  stateName: string;
  stateCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserAttributesService {
  private API_ENDPOINT;
  private httpOptions;
  private apiToken;

  constructor(
      private http: HttpClient,
      private storageService: StorageService,
      private oauthService: OAuthService
  ) {
    // Following change to the end point is made as the end point is moved to UI server

    this.API_ENDPOINT = '/api';
    this.httpOptions = this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  async setUserAttributes() {

    if (this.oauthService.getAccessToken()) {
      this.apiToken = this.oauthService.getAccessToken();
    } else {
      this.apiToken = '';
    }

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: 'Bearer ' + this.apiToken
      })
    };
    return this.http
    .get(this.API_ENDPOINT + '/user-attributes', this.httpOptions).toPromise().then((response) => {
      const attributes = response as unknown as UserAttributes;
      this.storageService.setItem('searchMode', 'NORMAL');
      this.storageService.setItem('searchValue', '');
      this.storageService.setItem(
          'role',
          attributes.role
          .replace('-', '')
          .toLowerCase()
      );
      this.storageService.setItem(
          'org',
          attributes.organizationId.toLowerCase()
      );
      this.storageService.setItem(
          'jurisdiction',
          attributes.organizationId
      );
    });
  }

  clearUserAttributes() {
    this.storageService.clearItem('datacall');
    this.storageService.clearItem('jurisdiction');
    this.storageService.clearItem('org');
    this.storageService.clearItem('role');
    this.storageService.clearItem('currentTab');
    this.storageService.clearItem('loginResult');
  }

}
