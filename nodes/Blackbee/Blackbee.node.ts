import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { vendorOperations, vendorFields, billOperations, billFields } from './descriptions';
import {
	getAllStates,
	getCountries,
	getCurrencies,
	getNetTerms,
	getPaymentModes,
	getStates,
	getVendorTypes,
} from './methods/loadOptions';
import { searchBusinessUnits, searchGlCodes } from './methods/listSearch';

export class Blackbee implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Blackbee',
		name: 'blackbee',
		icon: 'file:blackbee.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Blackbee Accounts-Payable API',
		defaults: { name: 'Blackbee' },
		codex: {
			categories: ['Finance & Accounting'],
			subcategories: {
				'Finance & Accounting': ['Accounting'],
			},
			resources: {
				primaryDocumentation: [
					{ url: 'https://www.npmjs.com/package/n8n-nodes-blackbee' },
				],
				credentialDocumentation: [
					{ url: 'https://www.npmjs.com/package/n8n-nodes-blackbee' },
				],
			},
			alias: ['accounts payable', 'AP', 'invoice', 'bill', 'vendor', 'payment', 'blackbee'],
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'blackbeeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Bill', value: 'bills' },
					{ name: 'Vendor', value: 'vendors' },
				],
				default: 'vendors',
			},
			...vendorOperations,
			...vendorFields,
			...billOperations,
			...billFields,
		],
	};

	methods = {
		loadOptions: {
			getCountries,
			getStates,
			getAllStates,
			getCurrencies,
			getVendorTypes,
			getNetTerms,
			getPaymentModes,
		},
		listSearch: {
			searchGlCodes,
			searchBusinessUnits,
		},
	};
}
