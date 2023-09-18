import { Injectable } from '@angular/core';
import {
	Router,
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { StorageService } from './storage.service';
import { OAuthService } from 'angular-oauth2-oidc';
import {state} from "@angular/animations";

@Injectable({
	providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.oauthService.hasValidAccessToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
