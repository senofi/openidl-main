import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { AuthService } from 'openidl-common-ui';
import { NotifierService } from 'openidl-common-ui';
import { StorageService } from 'openidl-common-ui';
import { MESSAGE } from 'openidl-common-ui';
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
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/datacallList']); // Update with your home route
    }
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    // this.clearStorage();
  }

  login(value, formDirective: FormGroupDirective) {
    console.log("asdasdasd")
    console.log(this.oauthService)
    this.oauthService.initLoginFlow()
    // console.log('userform value ', value);
    // if (this.userForm.valid) {
    //   this.model = value;
    //   this.isSpinner = true;
    //   console.log('asdasdas')
    //   this.authService.authenticate(this.model).subscribe(
    //     (response) => {
    //       console.log('asdasd')
    //
    //       if (response.status === 302 || response.status === 301) {
    //         const redirectUrl = response.headers.get('test-location');
    //         if (redirectUrl) {
    //           window.location.href = redirectUrl;
    //         }
    //       }
    //
    //       // console.log('Login response: ', response);
    //       // const userToken = response.result.userToken;
    //       // this.storageService.setItem(
    //       //   'role',
    //       //   response.result.attributes.role.replace('-', '').toLowerCase()
    //       // );
    //       // this.storageService.setItem(
    //       //   'org',
    //       //   response.result.attributes.organizationId.toLowerCase()
    //       // );
    //       //
    //       // // this.storageService.setItem('jurisdiction', (response.result.attributes.organizationId).split(' ')[0]);
    //       // // this.storageService.setItem('jurisdiction', (response.result.attributes.stateName));
    //       //
    //       // if (
    //       //   response.result.attributes.stateName != null ||
    //       //   typeof response.result.attributes.stateName !== 'undefined'
    //       // ) {
    //       //   this.storageService.setItem(
    //       //     'jurisdiction',
    //       //     response.result.attributes.stateName
    //       //   );
    //       //   console.log(
    //       //     'jurisdiction 1: ',
    //       //     response.result.attributes.stateName
    //       //   );
    //       // } else {
    //       //   this.storageService.setItem(
    //       //     'jurisdiction',
    //       //     response.result.attributes.organizationId.split(' ')[0]
    //       //   );
    //       //   console.log(
    //       //     'jurisdiction 2: ',
    //       //     response.result.attributes.organizationId.split(' ')[0]
    //       //   );
    //       // }
    //       //
    //       // this.storageService.setItem('apiToken', userToken);
    //       // this.storageService.setItem('loginResult', response.result);
    //       // this.storageService.setItem('userToken', response.result.userToken);
    //       // this.storageService.setItem('searchMode', 'NORMAL');
    //       // this.storageService.setItem('searchValue', '');
    //       // this.isSpinner = false;
    //       // this.userForm = this.formBuilder.group({
    //       //   username: ['', Validators.required],
    //       //   password: ['', Validators.required],
    //       // });
    //       // this.router.navigate(['/datacallList']);
    //     },
    //     (error) => {
    //       this.isError = true;
    //       this.isSpinner = false;
    //       formDirective.resetForm();
    //       this.userForm.reset();
    //
    //       this.notifierService.openSnackbar(
    //         MESSAGE.LOGIN.INVALID_CREDENTIALS.type,
    //         MESSAGE.LOGIN.INVALID_CREDENTIALS.title,
    //         MESSAGE.LOGIN.INVALID_CREDENTIALS.message
    //       );
    //     }
    //   );
    // }
    // later it should be data call list
  }

  closeNotify() {
    this.isError = false;
  }

  clearStorage() {
    this.storageService.clearItem('apiToken');
    this.storageService.clearItem('tokenType');
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
