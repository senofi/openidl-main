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
	// constructor(private r: Router, private storageService: StorageService) {}
  //
	// canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
	// 	console.log('Checking the AuthGuard');
	// 	console.log('Route Requested' + JSON.stringify(state.url));
	// 	if (this.storageService.getItem('apiToken')) {
	// 		return true;
	// 	}
	// 	this.r.navigateByUrl('/login');
	// 	return false;
	// }

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
