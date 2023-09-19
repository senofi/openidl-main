import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {appConst} from '../const/app.const';

import {DataService, StorageService} from 'openidl-common-ui';
import {OAuthService} from "angular-oauth2-oidc";
import {
  UserAttributesService
} from "../../../../openidl-common-ui/src/lib/services/user-attributes.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() selected;
  appConst;
  role;
  orgLogo;
  orgLogoError;
  roleIcon;
  org;
  isSpinner: Boolean = false;
  isResetBtn: Boolean = false;

  constructor(
      private storageService: StorageService,
      private dataService: DataService,
      private router: Router,
      private oAuthService: OAuthService,
      private userAttributesService: UserAttributesService
  ) {
    this.role = this.storageService.getItem('role');
    this.org = this.storageService.getItem('org');
    this.appConst = appConst[this.role];
    this.orgLogo = this.orgIcon(this.org);
    this.roleIcon = appConst.roles[this.role];
  }

  ngOnInit() {
  }

  setSelected(selected) {
    this.selected = selected;
  }

  logout() {
    this.isSpinner = true;
    this.oAuthService.logOut()
    this.isSpinner = false;
    this.userAttributesService.clearUserAttributes();
  }

  toggleResetBtn() {
    this.isResetBtn = !this.isResetBtn;
  }

  goHome() {
    if (this.router.url !== '/datacallList') {
      this.router.navigate(['/datacallList']);
    } else {
      location.reload();
    }
  }

  resetData() {
    this.isSpinner = true;
    this.dataService.deleteData('/reset-data').subscribe(
        (res) => {
          console.log(res);
          this.isSpinner = false;
          this.isResetBtn = false;
          this.setSelected(0);
          this.router.navigate(['/datacallList']);
        },
        (err) => {
          this.isSpinner = false;
          this.isResetBtn = false;
        }
    );
  }

  orgIcon(org) {
    return this.storageService.getItem('iconBucketUrl') + org + '-logo.png';
  }

  onImageError(event: any): void {
    this.orgLogoError = true;
  }
}
