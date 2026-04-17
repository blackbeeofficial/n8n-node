import { INodeProperties } from 'n8n-workflow';
import { resolveBillFile } from '../../methods/preSend';

export const billOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bills'] } },
		options: [
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload a bill',
				description:
					'Upload a bill document (PDF, JPG, JPEG, PNG) and create a bill (triggers AI parsing)',
				routing: {
					request: { method: 'POST', url: '/ap-api/bill/upload' },
					send: { preSend: [resolveBillFile] },
				},
			},
		],
		default: 'upload',
	},
];
