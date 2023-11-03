import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DatacallListComponent} from './../datacall-list/datacall-list.component';
import {LoginComponent} from './../login/login.component';
import {AuthCallbackComponent, AuthGaurdService} from 'openidl-common-ui';
import {ViewDatacallDraftComponent} from '../view-datacall-draft/view-datacall-draft.component';
import {ViewDatacallIssuedComponent} from '../view-datacall-issued/view-datacall-issued.component';
import {ViewReportComponent} from '../view-report/view-report.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'auth-callback', component: AuthCallbackComponent},
  {
    path: 'datacallList',
    component: DatacallListComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'viewDraft',
    component: ViewDatacallDraftComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'viewIssued',
    component: ViewDatacallIssuedComponent,
    canActivate: [AuthGaurdService]
  },
  {
    path: 'viewReport',
    component: ViewReportComponent,
    canActivate: [AuthGaurdService]
  },
  {path: '**', redirectTo: '/login'},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
