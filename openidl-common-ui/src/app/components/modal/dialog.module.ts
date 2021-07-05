import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
	DialogConfirmationComponent,
	DialogDateComponent,
	DialogDeleteDataComponent,
	DialogForumComponent,
	DialogPatternComponent,
	DialogSessionComponent
} from './modal.component';
import { MaterialModule } from '../../material.module';

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [
		DialogSessionComponent,
		DialogDeleteDataComponent,
		DialogConfirmationComponent,
		DialogForumComponent,
		DialogPatternComponent,
		DialogDateComponent
	],
	exports: [
		MaterialModule,
		DialogSessionComponent,
		DialogDeleteDataComponent,
		DialogConfirmationComponent,
		DialogForumComponent,
		DialogPatternComponent,
		DialogDateComponent
	],
	providers: []
})
export class DialogModule {}
