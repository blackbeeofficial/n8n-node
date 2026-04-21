import {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export async function getBlackbeeBaseUrl(
	this:
		| ILoadOptionsFunctions
		| IExecuteFunctions
		| IExecuteSingleFunctions
		| IHookFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('blackbeeApi');
	return (credentials.baseUrl as string) ?? '';
}

export async function blackbeeApiRequest(
	this: ILoadOptionsFunctions | IExecuteFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
): Promise<any> {
	const baseURL = await getBlackbeeBaseUrl.call(this);
	return this.helpers.httpRequestWithAuthentication.call(this, 'blackbeeApi', {
		method,
		baseURL,
		url: endpoint,
		qs,
		body,
		json: true,
	});
}
