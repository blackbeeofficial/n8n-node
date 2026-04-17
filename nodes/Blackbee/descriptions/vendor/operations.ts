import { INodeProperties } from 'n8n-workflow';
import { resolveAddressLabels, resolveAttachmentFiles } from '../../methods/preSend';

export const vendorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['vendors'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a vendor',
				description: 'Create a new vendor record',
				routing: {
					request: { method: 'POST', url: '/ap-api/vendor/create' },
					send: { preSend: [resolveAddressLabels, resolveAttachmentFiles] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a vendor',
				description: 'Fetch a single vendor by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/ap-api/vendor/{{$parameter["vendorId"]}}',
					},
				},
			},
			{
				name: 'Get List',
				value: 'list',
				action: 'Get a list of vendors',
				description: 'Fetch a paginated, filtered list of vendors',
				routing: {
					request: {
						method: 'POST',
						url: '/ap-api/vendor/list',
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
		default: 'create',
	},
];
