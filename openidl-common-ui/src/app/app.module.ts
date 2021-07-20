import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
	CUSTOM_ELEMENTS_SCHEMA,
	NgModule,
	NO_ERRORS_SCHEMA
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { PipesModule } from './pipes/pipes.module';
import { ConfigModule } from './config/config.module';
import { ServicesModule } from './services/services.module';
import { OpenidlCommonComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FormComponent } from './components/form/form.component';
import { TableComponent } from './components/table/table.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SearchComponent } from './components/search/search.component';
import { NotifyComponent } from './components/notify/notify.component';
import { SearchPipe } from './pipes/search.pipe';
import { UpdateFormComponent } from './components/update-form/update-form.component';
import { DatacallsIssuedComponent } from './components/datacalls-issued/datacalls-issued.component';
import { DatacallHistoryComponent } from './components/datacall-history/datacall-history.component';
import { BlocksHistoryComponent } from './components/blocks-history/blocks-history.component';
import { ReportTableComponent } from './components/report-table/report-table.component';
import { UpdateReportComponent } from './components/update-report/update-report.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DialogModule } from './components/dialogs/dialog.module';
import { MaterialModule } from './material.module';

@NgModule({
	declarations: [
		OpenidlCommonComponent,
		LoginComponent,
		HeaderComponent,
		FormComponent,
		TableComponent,
		SpinnerComponent,
		PaginationComponent,
		SearchComponent,
		NotifyComponent,
		SearchPipe,
		UpdateFormComponent,
		DatacallsIssuedComponent,
		DatacallHistoryComponent,
		BlocksHistoryComponent,
		UpdateReportComponent,
		ReportTableComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		PipesModule,
		ConfigModule,
		ServicesModule,
		LoginModule,
		ReactiveFormsModule,
		MaterialModule,
		DialogModule
	],
	exports: [
		OpenidlCommonComponent,
		FormComponent,
		TableComponent,
		ServicesModule,
		SearchComponent,
		SpinnerComponent,
		PaginationComponent,
		SearchComponent,
		NotifyComponent,
		SearchPipe,
		UpdateFormComponent,
		DatacallsIssuedComponent,
		DatacallHistoryComponent,
		BlocksHistoryComponent,
		UpdateReportComponent,
		ReportTableComponent,
		MaterialModule,
		DialogModule
	],
	providers: [],
	bootstrap: [OpenidlCommonComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class OpenidlCommonModule {}
