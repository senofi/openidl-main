import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGaurdService } from '../../../openidl-common-ui/src/app/services/authgaurd.service';
import { StorageService } from '../../../openidl-common-ui/src/app/services/storage.service';
import { DataService } from '../../../openidl-common-ui/src/app/services/data.service';
import { AuthService } from '../../../openidl-common-ui/src/app/services/auth.service';
import { AppComponent } from './app.component';
import { OpenidlCommonModule } from '../../../openidl-common-ui/src/app/app.module';
import { CreateDatacallComponent } from './create-datacall/create-datacall.component';
import { DatacallListComponent } from './datacall-list/datacall-list.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './router/app.routes';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ViewDatacallDraftComponent } from './view-datacall-draft/view-datacall-draft.component';
import { ViewDatacallIssuedComponent } from './view-datacall-issued/view-datacall-issued.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { ClipboardModule } from 'ngx-clipboard';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
	declarations: [
		AppComponent,
		CreateDatacallComponent,
		DatacallListComponent,
		LoginComponent,
		HeaderComponent,
		ViewDatacallDraftComponent,
		ViewDatacallIssuedComponent,
		ViewReportComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		OpenidlCommonModule,
		TabsModule.forRoot(),
		ClipboardModule,
		DataTablesModule,
		BrowserAnimationsModule,
		LayoutModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatCardModule,
		MatGridListModule,
		MatProgressSpinnerModule,
		MatFormFieldModule
	],
	providers: [AuthGaurdService, StorageService, DataService, AuthService],
	bootstrap: [AppComponent]
})
export class AppModule {}
