import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	Inject,
	OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { MESSAGE } from './../../../../src/assets/messageBundle';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
	@Input() title;
	@Input() message;
	@Input() type;
	@Input() data;
	@Input() isData;
	@Input() isSessionExpired;

	@Output() modalClose = new EventEmitter();
	@Output() forumData: any = new EventEmitter();
	@Output() redirectLogin = new EventEmitter();
	@Output() deliveryDate = new EventEmitter();
	@Output() deleteData = new EventEmitter();
	@Output() confirmation = new EventEmitter();
	@ViewChild('template') template: ElementRef;
	@ViewChild('forumtemplate') forumtemplate: ElementRef;
	@ViewChild('datetemplate') datetemplate: ElementRef;
	@ViewChild('deleteDataTemplate') deleteDataTemplate: ElementRef;
	@ViewChild('confirmationTemplate') confirmationTemplate: ElementRef;
	@ViewChild('patternTemplate') patternTemplate: ElementRef;
	@ViewChild('showPatternDetailsTemplate')
	showPatternDetailsTemplate: ElementRef;

	patternMessage = MESSAGE.EXTRACTION_PATTERN_MESSAGE.message;

	config = {
		backdrop: true,
		ignoreBackdropClick: true
	};
	pattern: any;
	selectedAll: any;
	patternDetails: any;
	isDownloadBtnDisabled: boolean = true;

	constructor(private authService: AuthService) {}

	ngOnInit() {}

	updateDelivery() {
		// this.modalRef.hide();
		this.deliveryDate.emit(this.data);
	}

	updateForum() {
		// this.modalRef.hide();
		this.forumData.emit(this.data);
	}

	confirmDelete() {
		// this.modalRef.hide();
		this.deleteData.emit();
	}

	confirm() {
		// this.modalRef.hide();
		this.confirmation.emit();
	}

	close() {
		// TODO: Remove opened modal from session storage
		sessionStorage.removeItem('isModalOpen');
		if (this.isData) {
			this.isData = false;
		}
		// this.modalRef.hide();
		this.modalClose.emit();
	}

	redirectToLogin() {
		// this.modalRef.hide();
		this.authService.logout('login').subscribe(
			(resp) => {
				console.log(resp);
			},
			(err) => {
				console.log(err);
			}
		);
		// this.redirectLogin.emit();
	}

	selectAll() {
		this.selectedAll = !this.selectedAll;
		this.isDownloadBtnDisabled = !this.selectedAll;
		for (var i = 0; i < this.pattern.length; i++) {
			this.pattern[i].selected = this.selectedAll;
		}

		console.log('selectAll() ', this.pattern, this.isDownloadBtnDisabled);
	}

	checkIfAllSelected(index) {
		this.pattern[index].selected = !this.pattern[index].selected;
		var totalSelected = 0;

		for (var i = 0; i < this.pattern.length; i++) {
			if (this.pattern[i].selected) {
				totalSelected++;
				this.isDownloadBtnDisabled = false;
			}
		}

		if (totalSelected === this.pattern.length) {
			this.selectedAll = true;
			this.isDownloadBtnDisabled = false;
		} else this.selectedAll = false;

		console.log(this.pattern, totalSelected);
		if (totalSelected == 0) this.isDownloadBtnDisabled = true;

		return true;
	}
}

@Component({
	selector: 'app-dialog-session',
	templateUrl: 'dialog-session.component.html'
})
export class DialogSessionComponent implements OnDestroy {
	private authSubscription: Subscription;

	constructor(
		public dialogRef: MatDialogRef<DialogSessionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private authService: AuthService
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
		if (this.authSubscription) this.authSubscription.unsubscribe();
	}

	redirectToLogin() {
		this.authSubscription = this.authService.logout('login').subscribe(
			(resp) => {
				console.log(resp);
				this.dialogRef.close();
			},
			(err) => {
				console.log(err);
				this.dialogRef.close();
			}
		);
		// this.redirectLogin.emit();
	}
}
@Component({
	selector: 'app-dialog-delete-data',
	templateUrl: 'dialog-delete-data.component.html'
})
export class DialogDeleteDataComponent implements OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DialogDeleteDataComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickYes() {}
}

@Component({
	selector: 'app-dialog-confirmation',
	templateUrl: 'dialog-confirmation.component.html'
})
export class DialogConfirmationComponent implements OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DialogConfirmationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickYes() {}
}

@Component({
	selector: 'app-dialog-forum',
	templateUrl: 'dialog-forum.component.html'
})
export class DialogForumComponent implements OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DialogForumComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickUpdate() {}
}

@Component({
	selector: 'app-dialog-pattern',
	templateUrl: 'dialog-pattern.component.html'
})
export class DialogPatternComponent implements OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DialogPatternComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickUpdate() {}
}

@Component({
	selector: 'app-dialog-date',
	templateUrl: 'dialog-date.component.html'
})
export class DialogDateComponent implements OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<DialogDateComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickUpdate() {}
}
