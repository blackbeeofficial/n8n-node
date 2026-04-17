import { INodeProperties } from 'n8n-workflow';

export const uploadFields: INodeProperties[] = [
	{
		displayName: 'File (Binary Property)',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['bills'], operation: ['upload'] } },
		description:
			'Name of the binary property on the incoming item that holds the bill file (PDF, JPG, JPEG, PNG). The node reads this property and posts it as the multipart `file` part.',
	},
];
