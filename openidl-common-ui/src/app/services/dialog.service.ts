import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGE } from '../../assets/messageBundle';
import {
	DialogConfirmationComponent,
	DialogDeleteDataComponent,
	DialogSessionComponent
} from '../components/modal/modal.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
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
			this.dialog.open(DialogSessionComponent, {
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

	handleNotification(error, messageBundle) {
		console.log('in handleNotification >> ' + messageBundle.message);

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
			data: {
				type,
				title,
				message
			}
		});
	}

	openConfirmationModal(title: string, message: string, type: string) {
		this.dialog.open(DialogConfirmationComponent, {
			data: {
				type,
				title,
				message
			}
		});
	}
}
