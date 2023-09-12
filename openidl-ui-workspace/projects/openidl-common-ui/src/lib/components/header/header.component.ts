import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private oauthService: OAuthService, private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.oauthService.revokeTokenAndLogout();
    this.router.navigate(['/login']);
  }

}
