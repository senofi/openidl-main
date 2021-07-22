import { BrowserModule } from '@angular/platform-browser';
import {
	CUSTOM_ELEMENTS_SCHEMA,
	NgModule,
	NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AuthGaurdService } from 'openidl-common-ui';
import { OpenidlCommonModule } from 'openidl-common-ui';
import { StorageService } from 'openidl-common-ui';
import { DataService } from 'openidl-common-ui';
import { AuthService } from 'openidl-common-ui';
import { MaterialModule } from 'openidl-common-ui';

import { AppComponent } from './app.component';
import { CreateDatacallComponent } from './create-datacall/create-datacall.component';
import { DatacallListComponent } from './datacall-list/datacall-list.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './router/app.routes';
import { ViewDatacallDraftComponent } from './view-datacall-draft/view-datacall-draft.component';
import { ViewDatacallIssuedComponent } from './view-datacall-issued/view-datacall-issued.component';
import { ViewReportComponent } from './view-report/view-report.component';

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
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		OpenidlCommonModule,
		LayoutModule,
		MaterialModule
		// MatToolbarModule,
		// MatButtonModule,
		// MatSidenavModule,
		// MatIconModule,
		// MatListModule,
		// MatInputModule,
		// MatSelectModule,
		// MatRadioModule,
		// MatCardModule,
		// MatGridListModule,
		// MatProgressSpinnerModule,
		// MatFormFieldModule,
		// MatMenuModule,
		// MatButtonToggleModule,
	],
	exports: [MaterialModule],
	providers: [AuthGaurdService, StorageService, DataService, AuthService],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
