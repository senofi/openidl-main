import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MESSAGE } from '../../assets/messageBundle';
import { DialogConfirmationComponent } from '../components/dialogs/dialog-confirmation.component/dialog-confirmation.component';
import { DialogDeleteDataComponent } from '../components/dialogs/dialog-delete-data.component/dialog-delete-data.component';
import { DialogForumComponent } from '../components/dialogs/dialog-forum.component/dialog-forum.component';
import { DialogPatternComponent } from '../components/dialogs/dialog-pattern.component/dialog-pattern.component';
import { DialogSessionComponent } from '../components/dialogs/dialog-session.component/dialog-session.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	readonly dialogConfig = {
		height: '', //'400px',
		width: '' // '600px'
	};

	constructor(private dialog: MatDialog) {}

	openModal(
		title: string,
		message: string,
		type: string,
		isSessionExpired = false
	) {
		// TODO: Check if any modal is already opened
		const isModalOpen = sessionStorage.getItem('isModalOpen');

		// TODO: If one modal is open then do not show another modal
		if (isModalOpen !== 'true') {
			let d = this.dialog.open(DialogSessionComponent, {
				...this.dialogConfig,
				data: {
					type,
					title,
					message,
					isSessionExpired
				}
			});

			sessionStorage.setItem('isModalOpen', 'true');
		}
	}

	handleNotification(error, messageBundle, locale = 'en-US') {
		if (error === 'Unauthorized') {
			setTimeout(() => {
				this.openModal(
					MESSAGE.ACTIVITY_FAIL.Unauthorized.title,
					MESSAGE.ACTIVITY_FAIL.Unauthorized.message,
					MESSAGE.ACTIVITY_FAIL.Unauthorized.type,
					true
				);
			}, 100);
		} else {
			setTimeout(() => {
				this.openModal(
					messageBundle.title,
					messageBundle.message,
					messageBundle.type
				);
			}, 100);
		}
	}

	openDeleteDataModal(title: string, message: string, type: string) {
		this.dialog.open(DialogDeleteDataComponent, {
			...this.dialogConfig,
			data: {
				type,
				title,
				message
			}
		});
	}

	openConfirmationModal(title: string, message: string, type: string) {
		this.dialog.open(DialogConfirmationComponent, {
			...this.dialogConfig,
			data: {
				type,
				title,
				message
			}
		});
	}

	openInfoModal(
		title: string,
		message: string,
		type: string,
		data: any,
		isData: boolean
	) {
		// TODO: Check if any modal is already opened
		const isModalOpen = sessionStorage.getItem('isModalOpen');

		// TODO: If one modal is open then do not show another modal
		if (isModalOpen !== 'true') {
			this.dialog.open(DialogSessionComponent, {
				...this.dialogConfig,
				data: {
					type,
					title,
					message,
					data,
					isData
				}
			});
			sessionStorage.setItem('isModalOpen', 'true');
		}
	}

	openForumModal(
		title: string,
		message: string,
		type: string,
		data: any,
		isData: boolean
	) {
		this.dialog.open(DialogForumComponent, {
			...this.dialogConfig,
			data: {
				type,
				title,
				message,
				data,
				isData
			}
		});
	}

	openDeliveryModal(
		title: string,
		message: string,
		type: string,
		date: Date
	) {
		this.dialog.open(DialogSessionComponent, {
			...this.dialogConfig,
			data: {
				title,
				message,
				type,
				date
			}
		});
	}

	openPattern(pattern, type) {
		// TODO: Check if any modal is already opened
		const isModalOpen = sessionStorage.getItem('isModalOpen');

		// TODO: If one modal is open then do not show another modal
		if (isModalOpen !== 'true') {
			this.dialog.open(DialogPatternComponent, {
				...this.dialogConfig,
				data: {
					type,
					pattern
				}
			});
			sessionStorage.setItem('isModalOpen', 'true');
		}
	}

	openPatternDetails(data: any, type: string) {
		const isModalOpen = sessionStorage.getItem('isModalOpen');
		// TODO: If one modal is open then do not show another modal
		if (isModalOpen !== 'true') {
			data[0].selected = true;

			this.dialog.open(DialogSessionComponent, {
				...this.dialogConfig,
				data: {
					type,
					data
				}
			});
			sessionStorage.setItem('isModalOpen', 'true');
		}
	}
}
