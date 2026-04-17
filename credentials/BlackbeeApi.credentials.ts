import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BlackbeeApi implements ICredentialType {
	name = 'blackbeeApi';
	displayName = 'Blackbee API';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
	documentationUrl = 'https://www.npmjs.com/package/n8n-nodes-blackbee';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Sent as the Authorization: ApiKey header on every request.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=ApiKey {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-dev.blackbeeai.com',
			url: '/masterdata-api/companies/label-values',
			method: 'GET',
		},
	};
}
