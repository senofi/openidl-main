import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Injectable({
	providedIn: 'root'
})
export class CsvService {
	constructor() {}

	downloadCsv(data: Array<any>, fileName = 'extraction-patterns') {
		const output = [];
		let definition_mongo = '';
		data.forEach((element) => {
			let csvData = {};
			let definition_cloudant = element.viewDefinition_cloudant;
			definition_mongo = element.viewDefinition_mongo;
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
				typeof definition_mongo == undefined ||
				typeof definition_mongo == 'undefined' ||
				definition_mongo == ''
			) {
				definition_mongo = '-';
			} else {
				definition_mongo = JSON.stringify(definition_mongo);
				definition_mongo = definition_mongo.replace(/\\n/g, '\n');
				definition_mongo = definition_mongo.replace(/\/\//g, '&&&');
				definition_mongo = definition_mongo.replace(/\\"/g, "'");
				definition_mongo = definition_mongo.replace(/&&&/g, '//');

				/**
				 * Below fix is to replace map and reduce key words from source script
				 * inline added to see the result on mongodb client
				 */
				let findFunctionIndex = definition_mongo.indexOf('function()');
				definition_mongo = definition_mongo.substring(
					findFunctionIndex,
					definition_mongo.length - 2
				);
				definition_mongo = definition_mongo.replace(
					'","reduce":"',
					','
				);
				definition_mongo = definition_mongo + ',{out:{inline:1}}';
			}
			csvData['Pattern_ID'] = element.extractionPatternID;
			csvData['Pattern_Name'] = element.extractionPatternName;
			csvData['Description'] = element.description;
			csvData['definition_cloudant'] = definition_cloudant;
			csvData['definition_mongo'] = definition_mongo;
			output.push(csvData);
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
		new ngxCsv(output, fileName, options);
	}
}
