import { INodeProperties } from 'n8n-workflow';
import {
	ATTACHMENT_TYPE_OPTIONS,
	BANK_ACCOUNT_TYPE_OPTIONS,
	BUSINESS_TYPE_OPTIONS,
	addressValues,
} from './shared';

export const createFields: INodeProperties[] = [
	// CREATE: required field
	{
		displayName: 'Vendor Name',
		name: 'vendorName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		description: 'Legal name of the vendor',
		routing: { send: { type: 'body', property: 'vendorName' } },
	},

	// CREATE: optional scalar fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		options: [
			{
				displayName: 'Business Type',
				name: 'businessType',
				type: 'options',
				options: BUSINESS_TYPE_OPTIONS,
				default: 'INDIVIDUAL',
				displayOptions: { show: { isEligible1099: [true] } },
				routing: { send: { type: 'body', property: 'businessType' } },
			},
			{
				displayName: 'Default Currency Name or ID',
				name: 'defaultCurrency',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: { send: { type: 'body', property: 'defaultCurrency' } },
			},
			{
				displayName: 'Default GL Code',
				name: 'defaultGlCode',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Search GL codes…',
						typeOptions: {
							searchListMethod: 'searchGlCodes',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 1000',
					},
				],
				routing: {
					send: { type: 'body', property: 'defaultGlCode', value: '={{ $value.value }}' },
				},
			},
			{
				displayName: 'Email',
				name: 'emailId',
				type: 'string',
				placeholder: 'name@example.com',
				default: '',
				routing: { send: { type: 'body', property: 'emailId' } },
			},
			{
				displayName: 'Fax',
				name: 'faxId',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'faxId' } },
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'firstName' } },
			},
			{
				displayName: 'Is Eligible 1099',
				name: 'isEligible1099',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'isEligible1099' } },
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'lastName' } },
			},
			{
				displayName: 'Net Terms Name or ID',
				name: 'netTerms',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getNetTerms' },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: { send: { type: 'body', property: 'netTerms' } },
			},
			{
				displayName: 'Payment Mode Name or ID',
				name: 'paymentMode',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getPaymentModes' },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: { send: { type: 'body', property: 'paymentMode' } },
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'phoneNumber' } },
			},
			{
				displayName: 'Tax ID',
				name: 'taxId',
				type: 'string',
				default: '',
				description: '9-digit tax identifier (EIN/SSN). Leave empty or supply exactly 9 digits.',
				routing: { send: { type: 'body', property: 'taxId' } },
			},
			{
				displayName: 'Vendor Code',
				name: 'vendorCode',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'vendorCode' } },
			},
			{
				displayName: 'Vendor Type Name or ID',
				name: 'vendorType',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getVendorTypes' },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: { send: { type: 'body', property: 'vendorType' } },
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'website' } },
			},
		],
	},

	// CREATE: Address (single, nested)
	{
		displayName: 'Address',
		name: 'address',
		type: 'fixedCollection',
		placeholder: 'Add Address',
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'address',
				value: '={{ $value.details }}',
			},
		},
		options: [
			{
				name: 'details',
				displayName: 'Address',
				values: addressValues,
			},
		],
	},

	// CREATE: Bank Accounts (multiple, nested)
	{
		displayName: 'Bank Accounts',
		name: 'bankAccounts',
		type: 'fixedCollection',
		placeholder: 'Add Bank Account',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'bankAccounts',
				value: '={{ $value.item }}',
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Bank Account',
				values: [
					{
						displayName: 'Account Holder Name',
						name: 'accountHolderName',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Account Number',
						name: 'accountNumber',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Account Type',
						name: 'accountType',
						type: 'options',
						options: BANK_ACCOUNT_TYPE_OPTIONS,
						default: 'CHECKING',
					},
					{
						displayName: 'Bank Name',
						name: 'bankName',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'ERP ID',
						name: 'erpId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'IBAN Number',
						name: 'ibanNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Routing Number',
						name: 'routingNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Sort Code',
						name: 'sortCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'SWIFT BIC',
						name: 'swiftBic',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Wire Routing Number',
						name: 'wireRoutingNumber',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},

	// CREATE: Remit To Infos (multiple, nested)
	{
		displayName: 'Remit To Infos',
		name: 'remitToInfos',
		type: 'fixedCollection',
		placeholder: 'Add Remit To',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'remitToInfos',
				value: '={{ $value.item }}',
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Remit To',
				values: [
					{
						displayName: 'Account Number',
						name: 'accountNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'fixedCollection',
						placeholder: 'Add Address',
						default: {},
						options: [
							{
								name: 'details',
								displayName: 'Address',
								values: addressValues,
							},
						],
					},
					{
						displayName: 'Business Unit',
						name: 'businessUnit',
						type: 'resourceLocator',
						default: { mode: 'list', value: '' },
						modes: [
							{
								displayName: 'From List',
								name: 'list',
								type: 'list',
								placeholder: 'Search business units…',
								typeOptions: {
									searchListMethod: 'searchBusinessUnits',
									searchable: true,
								},
							},
							{
								displayName: 'By ID',
								name: 'id',
								type: 'string',
								placeholder: 'e.g. BU-001',
							},
						],
						description: 'Business unit to associate with this remit-to entry',
					},
					{
						displayName: 'ERP ID',
						name: 'erpId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Remit Name',
						name: 'remitName',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Same as Legal Address',
						name: 'sameAsLegalAddress',
						type: 'boolean',
						default: false,
					},
				],
			},
		],
	},

	// CREATE: Attachments (multiple, nested)
	{
		displayName: 'Attachments',
		name: 'attachments',
		type: 'fixedCollection',
		placeholder: 'Add Attachment',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'attachments',
				value: '={{ $value.item }}',
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Attachment',
				values: [
					{
						displayName: 'File',
						name: 'binaryPropertyName',
						type: 'string',
						required: true,
						default: 'data',
						description:
							'Name of the binary property on the incoming item that holds the file. The node reads this property and fills File Name (unique, auto-generated), Original File Name, and Size on the outgoing request.',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: ATTACHMENT_TYPE_OPTIONS,
						default: 'OTHER',
					},
				],
			},
		],
	},
];
