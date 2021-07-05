import { OnDestroy } from '@angular/core';
import {
	Component,
	OnInit,
	Input,
	HostListener,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	Inject
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
	// @Input() isopen;
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

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
		event: KeyboardEvent
	) {
		const isModalOpen = sessionStorage.getItem('isModalOpen');
		if (isModalOpen) {
			console.log('modal closed by esc key');
			this.modalClose.emit();
		}
	}

	// openModal(title, message, type) {
	// 	// TODO: Check if any modal is already opened
	// 	const isModalOpen = sessionStorage.getItem('isModalOpen');
	// 	this.title = title;
	// 	this.message = message;
	// 	this.type = type;
	// 	// TODO: If one modal is open then do not show another modal
	// 	if (isModalOpen !== 'true') {
	// 		this.dialog.open(DialogSessionComponent, {
	// 			data: {
	// 				type,
	// 				title,
	// 				message,
	// 				isSessionExpired: this.isSessionExpired
	// 			}
	// 		});
	// 		sessionStorage.setItem('isModalOpen', 'true');
	// 	}
	// }

	// openPattern(pattern, type) {
	// 	// TODO: Check if any modal is already opened
	// 	const isModalOpen = sessionStorage.getItem('isModalOpen');
	// 	// TODO: If one modal is open then do not show another modal
	// 	if (isModalOpen !== 'true') {
	// 		console.log('pattern is');
	// 		console.log(pattern);
	// 		this.type = type;
	// 		this.pattern = [];
	// 		this.pattern = pattern;
	// 		this.modalRef = this.modalService.show(
	// 			this.patternTemplate.nativeElement,
	// 			this.config
	// 		);
	// 		sessionStorage.setItem('isModalOpen', 'true');
	// 	} else {
	// 	}
	// }

	// openPatternDetails(data, type) {
	// 	// TODO: Check if any modal is already opened
	// 	const isModalOpen = sessionStorage.getItem('isModalOpen');
	// 	// TODO: If one modal is open then do not show another modal
	// 	if (isModalOpen !== 'true') {
	// 		// console.log('openPatternDetails response ', data);
	// 		this.type = type;
	// 		data[0].selected = true;
	// 		this.patternDetails = data;
	// 		// console.log("this.patternDetails :- ", this.patternDetails);
	// 		this.modalRef = this.modalService.show(
	// 			this.showPatternDetailsTemplate.nativeElement,
	// 			this.config
	// 		);
	// 		sessionStorage.setItem('isModalOpen', 'true');
	// 	} else {
	// 	}
	// }

	// openInfoModal(title, message, type, data, isData) {
	// 	this.data = data;
	// 	this.isData = isData;
	// 	console.log(data);
	// 	this.openModal(title, message, type);
	// }

	// openForumModal(title, message, type, data, isData) {
	// 	this.title = title;
	// 	this.message = message;
	// 	this.type = type;
	// 	this.data = data;
	// 	this.modalRef = this.modalService.show(
	// 		this.forumtemplate.nativeElement,
	// 		this.config
	// 	);
	// }

	// openDeleteDataModal(title, message, type) {
	// 	this.title = title;
	// 	this.message = message;
	// 	this.type = type;
	// 	this.modalRef = this.modalService.show(
	// 		this.deleteDataTemplate.nativeElement,
	// 		this.config
	// 	);
	// }

	// openConfirmationModal(title, message, type) {
	// 	this.title = title;
	// 	this.message = message;
	// 	this.type = type;
	// 	this.modalRef = this.modalService.show(
	// 		this.confirmationTemplate.nativeElement,
	// 		this.config
	// 	);
	// }

	// openDeliveryModal(title, message, type, data) {
	// 	this.title = title;
	// 	this.message = message;
	// 	this.type = type;
	// 	this.data = data;
	// 	this.modalRef = this.modalService.show(
	// 		this.datetemplate.nativeElement,
	// 		this.config
	// 	);
	// }

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

	// openSessionModal(title, message, type, isSessionExpired) {
	// 	this.isSessionExpired = isSessionExpired;
	// 	this.openModal(title, message, type);
	// }

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
	// common code to handle error notification
	// handleNotification(error, messageBundle, locale) {
	// 	console.log('in handleNotification >> ' + messageBundle.message);

	// 	if (error === 'Unauthorized') {
	// 		this.type = MESSAGE.ACTIVITY_FAIL.Unauthorized.type;
	// 		this.message = MESSAGE.ACTIVITY_FAIL.Unauthorized.message;
	// 		this.title = MESSAGE.ACTIVITY_FAIL.Unauthorized.title;
	// 		setTimeout(() => {
	// 			this.openSessionModal(
	// 				this.title,
	// 				this.message,
	// 				this.type,
	// 				true
	// 			);
	// 		}, 100);
	// 	} else {
	// 		this.type = messageBundle.type;
	// 		this.message = messageBundle.message;
	// 		this.title = messageBundle.title;
	// 		setTimeout(() => {
	// 			this.openModal(this.title, this.message, this.type);
	// 		}, 100);
	// 	}
	// }

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
	private dialogSubscription: Subscription;
	private authSubscription: Subscription;

	constructor(
		public dialogRef: MatDialogRef<DialogSessionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private authService: AuthService
	) {
		this.dialogSubscription = dialogRef
			.afterClosed()
			.subscribe((result) => {
				sessionStorage.removeItem('isModalOpen');
			});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) this.dialogSubscription.unsubscribe();
		if (this.authSubscription) this.authSubscription.unsubscribe();
	}

	redirectToLogin() {
		this.dialogRef.close();
		this.authSubscription = this.authService.logout('login').subscribe(
			(resp) => {
				console.log(resp);
			},
			(err) => {
				console.log(err);
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
	private dialogSubscription: Subscription;
	constructor(
		public dialogRef: MatDialogRef<DialogDeleteDataComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
			sessionStorage.removeItem('isModalOpen');
		});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) {
			this.dialogSubscription.unsubscribe();
		}
	}

	onClickYes() {}
}

@Component({
	selector: 'app-dialog-confirmation',
	templateUrl: 'dialog-confirmation.component.html'
})
export class DialogConfirmationComponent implements OnDestroy {
	private dialogSubscription: Subscription;
	constructor(
		public dialogRef: MatDialogRef<DialogConfirmationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
			sessionStorage.removeItem('isModalOpen');
		});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) {
			this.dialogSubscription.unsubscribe();
		}
	}

	onClickYes() {}
}

@Component({
	selector: 'app-dialog-forum',
	templateUrl: 'dialog-forum.component.html'
})
export class DialogForumComponent implements OnDestroy {
	private dialogSubscription: Subscription;
	constructor(
		public dialogRef: MatDialogRef<DialogForumComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
			sessionStorage.removeItem('isModalOpen');
		});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) {
			this.dialogSubscription.unsubscribe();
		}
	}

	onClickUpdate() {}
}

@Component({
	selector: 'app-dialog-pattern',
	templateUrl: 'dialog-pattern.component.html'
})
export class DialogPatternComponent implements OnDestroy {
	private dialogSubscription: Subscription;
	constructor(
		public dialogRef: MatDialogRef<DialogPatternComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
			sessionStorage.removeItem('isModalOpen');
		});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) {
			this.dialogSubscription.unsubscribe();
		}
	}

	onClickUpdate() {}
}

@Component({
	selector: 'app-dialog-date',
	templateUrl: 'dialog-date.component.html'
})
export class DialogDateComponent implements OnDestroy {
	private dialogSubscription: Subscription;
	constructor(
		public dialogRef: MatDialogRef<DialogDateComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
			sessionStorage.removeItem('isModalOpen');
		});
	}

	ngOnDestroy() {
		if (this.dialogSubscription) {
			this.dialogSubscription.unsubscribe();
		}
	}

	onClickUpdate() {}
}
