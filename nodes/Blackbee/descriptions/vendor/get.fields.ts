import { INodeProperties } from 'n8n-workflow';

export const getFields: INodeProperties[] = [
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['vendors'], operation: ['get'] } },
		description: 'The vendor ID to fetch',
	},
];
