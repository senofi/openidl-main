import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OAuthErrorEvent, OAuthService} from "angular-oauth2-oidc";
import {AuthConfigService} from "../../services/auth.config.service";

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private oauthService: OAuthService, private router: Router) {
  }

  ngOnInit() {

    if (this.oauthService.hasValidAccessToken()) {
      // Navigate to the desired default page after login
      this.router.navigate(['datacallList']);
    } else {
      // If not, then listen for the token_received event
      this.oauthService.events.subscribe(e => {
        if (e.type === 'token_received') {
          this.router.navigate(['datacallList']);
        } else if (e instanceof OAuthErrorEvent) {
          // Handle the error event - for instance, navigate to an error page or show an error message.
          this.router.navigate(['login'], { queryParams: { error: e } });
        }
      });
    }
  }
}
