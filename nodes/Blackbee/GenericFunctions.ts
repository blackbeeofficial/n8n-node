import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export const BLACKBEE_BASE_URL = 'https://api-dev.blackbeeai.com';

export async function blackbeeApiRequest(
	this: ILoadOptionsFunctions | IExecuteFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
): Promise<any> {
	return this.helpers.httpRequestWithAuthentication.call(this, 'blackbeeApi', {
		method,
		baseURL: BLACKBEE_BASE_URL,
		url: endpoint,
		qs,
		body,
		json: true,
	});
}
