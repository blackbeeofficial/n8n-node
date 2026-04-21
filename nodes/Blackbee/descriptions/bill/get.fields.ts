import { INodeProperties } from 'n8n-workflow';

export const getFields: INodeProperties[] = [
	{
		displayName: 'Bill URN',
		name: 'billUrn',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['bills'], operation: ['get'] } },
		description: 'The URN of the bill to fetch (e.g. returned by Bill → Upload)',
	},
];
