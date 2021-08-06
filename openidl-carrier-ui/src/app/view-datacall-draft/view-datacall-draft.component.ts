import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../openidl-common-ui/src/app/services/storage.service';

@Component({
	selector: 'app-view-datacall-draft',
	templateUrl: './view-datacall-draft.component.html',
	styleUrls: ['./view-datacall-draft.component.css']
})
export class ViewDatacallDraftComponent implements OnInit {
	isBack: Boolean = true;

	constructor(
		private router: Router,
		private storageService: StorageService
	) {}

	ngOnInit() {
		if (
			this.storageService.getItem('isShowIssuedDrafts') &&
			this.storageService.getItem('isShowIssuedDrafts') === 'true'
		) {
			this.isBack = false;
			this.storageService.clearItem('isShowIssuedDrafts');
		} else {
			this.isBack = true;
		}
	}

	goBack() {
		this.router.navigate(['/datacallList']);
	}
}
