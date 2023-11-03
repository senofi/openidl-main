import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OAuthErrorEvent, OAuthService} from "angular-oauth2-oidc";
import {UserAttributesService} from '../../services/user-attributes.service';
import {NotifierService} from "../../services/notifier.service";
import {MESSAGE} from "../../config/messageBundle";

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private oauthService: OAuthService, private router: Router, private userAttributesService: UserAttributesService, private notifierService: NotifierService) {
  }

  async ngOnInit() {

    if (this.oauthService.hasValidAccessToken()) {
      await this.userAttributesService.setUserAttributes().catch((error) => {
        this.notifierService.openSnackbar(
            MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.type,
            MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.title,
            MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.message
        );
        this.router.navigate(['login']);
      })
      this.router.navigate(['datacallList']);
    } else {
      this.oauthService.events.subscribe(async e => {
        if (e.type === 'token_received') {
          await this.userAttributesService.setUserAttributes().catch((error) => {
            this.notifierService.openSnackbar(
                MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.type,
                MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.title,
                MESSAGE.LOGIN.ERROR_WHEN_FETCHING_USER_ATTRIBUTES.message
            );
            this.router.navigate(['login'], {queryParams: {error: e}});
          })
          this.router.navigate(['datacallList']);
        } else if (e instanceof OAuthErrorEvent) {
          this.notifierService.openSnackbar(
              MESSAGE.LOGIN.INVALID_CREDENTIALS.type,
              MESSAGE.LOGIN.INVALID_CREDENTIALS.title,
              MESSAGE.LOGIN.INVALID_CREDENTIALS.message
          );
          // Handle the error event - for instance, navigate to an error page or show an error message.
          this.router.navigate(['login'], {queryParams: {error: e}});
        }
      });
    }
  }
}
