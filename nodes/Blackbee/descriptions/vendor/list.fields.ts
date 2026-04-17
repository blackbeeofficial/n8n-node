import { INodeProperties } from 'n8n-workflow';
import { VENDOR_STATUS_OPTIONS } from './shared';

export const listFields: INodeProperties[] = [
	// LIST: pagination
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1,
		displayOptions: { show: { resource: ['vendors'], operation: ['list'] } },
		description: 'Page number to fetch (1-based)',
		routing: { send: { type: 'body', property: 'page' } },
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 25,
		displayOptions: { show: { resource: ['vendors'], operation: ['list'] } },
		description: 'Number of items per page',
		routing: { send: { type: 'body', property: 'count' } },
	},

	// LIST: optional filters
	{
		displayName: 'Additional Fields',
		name: 'listAdditionalFields',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['vendors'], operation: ['list'] } },
		options: [
			{
				displayName: 'Risk',
				name: 'risk',
				type: 'fixedCollection',
				placeholder: 'Add Range',
				default: {},
				description: 'Risk score range (min/max, 0-100)',
				options: [
					{
						name: 'range',
						displayName: 'Range',
						values: [
							{ displayName: 'Min', name: 'min', type: 'string', default: '' },
							{ displayName: 'Max', name: 'max', type: 'string', default: '' },
						],
					},
				],
				routing: {
					send: { type: 'body', property: 'risk', value: '={{ $value.range || {} }}' },
				},
			},
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Free-text search across vendor name / code',
				routing: { send: { type: 'body', property: 'searchTerm' } },
			},
			{
				displayName: 'Sort Field',
				name: 'sortField',
				type: 'string',
				default: 'createdAt',
				routing: { send: { type: 'body', property: 'sortField' } },
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'ASC' },
					{ name: 'Descending', value: 'DESC' },
				],
				default: 'ASC',
				routing: { send: { type: 'body', property: 'sortOrder' } },
			},
			{
				displayName: 'Total Spend',
				name: 'totalSpend',
				type: 'fixedCollection',
				placeholder: 'Add Range',
				default: {},
				description: 'Total spend range (min/max, in base currency)',
				options: [
					{
						name: 'range',
						displayName: 'Range',
						values: [
							{ displayName: 'Min', name: 'min', type: 'string', default: '' },
							{ displayName: 'Max', name: 'max', type: 'string', default: '' },
						],
					},
				],
				routing: {
					send: { type: 'body', property: 'totalSpend', value: '={{ $value.range || {} }}' },
				},
			},
			{
				displayName: 'Vendor IDs',
				name: 'vendorIds',
				type: 'string',
				typeOptions: { multipleValues: true },
				default: [],
				description: 'Restrict results to these vendor IDs',
				routing: { send: { type: 'body', property: 'vendorIds' } },
			},
			{
				displayName: 'Vendor Statuses',
				name: 'vendorStatuses',
				type: 'multiOptions',
				options: VENDOR_STATUS_OPTIONS,
				default: [],
				routing: { send: { type: 'body', property: 'vendorStatuses' } },
			},
			{
				displayName: 'Vendor Type Names or IDs',
				name: 'vendorTypes',
				type: 'multiOptions',
				default: [],
				typeOptions: { loadOptionsMethod: 'getVendorTypes' },
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				routing: { send: { type: 'body', property: 'vendorTypes' } },
			},
		],
	},
];
