import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class NotifierService {
	constructor(private _snackBar: MatSnackBar) {}

	openSnackbar(type: string, title: string, message: string) {
		// const data: NotifierData = {
		// 	type,
		// 	title,
		// 	message
		// };
		// this._snackBar.openFromComponent(NotifierComponent, {
		// 	data: data
		// });
		this._snackBar.open(`${title} : ${message}`, 'Close');
	}
}
