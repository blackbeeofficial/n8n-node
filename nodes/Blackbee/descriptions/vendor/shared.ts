import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const BANK_ACCOUNT_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Checking', value: 'CHECKING' },
	{ name: 'Savings', value: 'SAVINGS' },
];

export const ATTACHMENT_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Contract', value: 'CONTRACT' },
	{ name: 'Other', value: 'OTHER' },
	{ name: 'W9', value: 'W9' },
];

export const BUSINESS_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Corporation', value: 'CORPORATION' },
	{ name: 'Individual / Sole Proprietor', value: 'INDIVIDUAL' },
	{ name: 'LLC', value: 'LLC' },
	{ name: 'Partnership', value: 'PARTNERSHIP' },
	{ name: 'Trust / Estate', value: 'TRUST' },
];

export const VENDOR_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Awaiting Approval', value: 'AWAITING_APPROVAL' },
	{ name: 'Draft', value: 'DRAFT' },
	{ name: 'Inactive', value: 'INACTIVE' },
	{ name: 'Rejected', value: 'REJECTED' },
];

// Reusable Address value-schema — used for top-level vendor.address and for
// remitToInfos[].address. countryCode and stateCode are dropdowns populated
// from label-value endpoints; the preSend hook fills the companion `country`
// and `state` name fields on the outgoing request.
export const addressValues: INodeProperties[] = [
	{
		displayName: 'Address Line 1',
		name: 'addressLine1',
		type: 'string',
		required: true,
		default: '',
	},
	{
		displayName: 'Address Line 2',
		name: 'addressLine2',
		type: 'string',
		default: '',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		required: true,
		default: '',
	},
	{
		displayName: 'Country Name or ID',
		name: 'countryCode',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getCountries' },
		description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		default: '',
	},
	{
		displayName: 'State Name or ID',
		name: 'stateCode',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getStates',
			loadOptionsDependsOn: ['countryCode'],
		},
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Zip Code',
		name: 'zipCode',
		type: 'string',
		required: true,
		default: '',
	},
];
