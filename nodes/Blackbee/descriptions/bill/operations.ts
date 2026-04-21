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
			{
				name: 'Get',
				value: 'get',
				action: 'Get a bill',
				description: 'Fetch a single bill by URN',
				routing: {
					request: {
						method: 'GET',
						url: '=/ap-api/bill/{{$parameter["billUrn"]}}',
					},
				},
			},
			{
				name: 'Get List',
				value: 'list',
				action: 'Get a list of bills',
				description: 'Fetch a paginated, filtered list of bills',
				routing: {
					request: {
						method: 'POST',
						url: '/ap-api/bill/list',
						body: {
							isFirstLoad: true,
							fields: [],
							isPagination: true,
							dateFormat: 'MM/DD/YYYY',
							sortField: 'createdAt',
							sortOrder: 'ASC',
						},
					},
				},
			},
		],
		default: 'upload',
	},
];
