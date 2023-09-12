import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { StorageService } from 'openidl-common-ui';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: any;
  password: any;
  model: any = {
    username: '',
    password: '',
  };
  userForm: FormGroup;
  isSpinner: boolean = false;
  title: any;
  message: any;
  type: any;
  isError: Boolean = false;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/datacallList']); // Update with your home route
    }
    this.clearStorage();
  }

  login() {
    this.oauthService.initLoginFlow()
  }

  closeNotify() {
    this.isError = false;
  }

  clearStorage() {
    this.storageService.clearItem('datacall');
    this.storageService.clearItem('jurisdiction');
    this.storageService.clearItem('org');
    this.storageService.clearItem('role');
    this.storageService.clearItem('loginResult');
    this.storageService.clearItem('isAbandon');
    this.storageService.clearItem('currentTab');
    this.storageService.clearItem('searchMode');
    this.storageService.clearItem('searchValue');
  }
}
