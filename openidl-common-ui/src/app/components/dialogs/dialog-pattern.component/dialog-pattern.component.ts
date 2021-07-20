import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
	selector: 'app-dialog-pattern',
	templateUrl: './dialog-pattern.component.html',
	styleUrls: ['./dialog-pattern.component.scss']
})
export class DialogPatternComponent implements OnDestroy {
	isDownloadDisable = true;
	displayedColumns: string[] = [
		'select',
		'extractionPatternName',
		'description'
	];
	dataSource: MatTableDataSource<any>;
	selection = new SelectionModel<any>(true, []);
	definition_mongo: string;
	constructor(
		public dialogRef: MatDialogRef<DialogPatternComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		console.log(data);
		this.dataSource = new MatTableDataSource(data.pattern);
	}

	ngOnDestroy() {
		sessionStorage.removeItem('isModalOpen');
	}

	onClickDownload() {
		let data = [];
		this.definition_mongo = '';
		this.selection.selected.forEach((element) => {
			let csvdata = {};
			let definition_cloudant = element.viewDefinition_cloudant;
			this.definition_mongo = element.viewDefinition_mongo;
			if (
				typeof definition_cloudant == undefined ||
				typeof definition_cloudant == 'undefined' ||
				definition_cloudant == ''
			) {
				definition_cloudant = '-';
			} else {
				definition_cloudant = JSON.stringify(definition_cloudant);
				definition_cloudant = definition_cloudant.replace(/\\n/g, '\n');
				definition_cloudant = definition_cloudant.replace(
					/\/\//g,
					'&&&'
				);
				definition_cloudant = definition_cloudant.replace(/\\/g, '');
				definition_cloudant = definition_cloudant.replace(/&&&/g, '//');
			}
			if (
				typeof this.definition_mongo == undefined ||
				typeof this.definition_mongo == 'undefined' ||
				this.definition_mongo == ''
			) {
				this.definition_mongo = '-';
			} else {
				this.definition_mongo = JSON.stringify(this.definition_mongo);
				this.definition_mongo = this.definition_mongo.replace(
					/\\n/g,
					'\n'
				);
				this.definition_mongo = this.definition_mongo.replace(
					/\/\//g,
					'&&&'
				);
				this.definition_mongo = this.definition_mongo.replace(
					/\\"/g,
					"'"
				);
				this.definition_mongo = this.definition_mongo.replace(
					/&&&/g,
					'//'
				);

				/**
				 * Below fix is to replace map and reduce key words from source script
				 * inline added to see the result on mongodb client
				 */
				let findFunctionIndex =
					this.definition_mongo.indexOf('function()');
				this.definition_mongo = this.definition_mongo.substring(
					findFunctionIndex,
					this.definition_mongo.length - 2
				);
				this.definition_mongo = this.definition_mongo.replace(
					'","reduce":"',
					','
				);
				this.definition_mongo =
					this.definition_mongo + ',{out:{inline:1}}';
			}
			csvdata['Pattern_ID'] = element.extractionPatternID;
			csvdata['Pattern_Name'] = element.extractionPatternName;
			csvdata['Description'] = element.description;
			csvdata['definition_cloudant'] = definition_cloudant;
			csvdata['definition_mongo'] = this.definition_mongo;
			data.push(csvdata);
		});
		var options = {
			headers: [
				'Pattern ID',
				'Pattern Name',
				'Pattern Description',
				'Cloudant Definition',
				'Mongo Definition'
			]
		};
		new ngxCsv(data, 'extraction-patterns', options);
		this.selection.clear();
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		const isAllSelected = numSelected === numRows;
		this.isDownloadDisable = !(this.selection.selected.length > 0);
		return isAllSelected;
	}

	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}
		this.isDownloadDisable = !this.isDownloadDisable;

		this.selection.select(...this.dataSource.data);
	}

	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
			row.position + 1
		}`;
	}
}
