import { randomUUID } from 'crypto';
import FormData from 'form-data';
import {
	IBinaryData,
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';
import { BLACKBEE_BASE_URL } from '../GenericFunctions';

type LabelValue = { label: string; value: string };

// Populate `country` (name) from `countryCode` and `state` (name) from
// `stateCode` on the top-level address and every remitToInfos[].address,
// because the backend requires both the code and the display name. Also
// unwraps nested `address.details` produced by the Address fixedCollection on
// remit-to items.
export async function resolveAddressLabels(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = (requestOptions.body ?? {}) as IDataObject;
	if (!body || typeof body !== 'object') return requestOptions;

	// Local per-request caches so repeated remit-to entries share one fetch.
	let countriesCache: LabelValue[] | undefined;
	const statesCache = new Map<string, LabelValue[]>();

	const fetchCountries = async (): Promise<LabelValue[]> => {
		if (countriesCache) return countriesCache;
		countriesCache = ((await httpGet.call(this, '/secure-auth/config/countries')) as LabelValue[]) ?? [];
		return countriesCache;
	};

	const fetchStates = async (countryCode: string): Promise<LabelValue[]> => {
		if (!countryCode) return [];
		const cached = statesCache.get(countryCode);
		if (cached) return cached;
		const states = ((await httpGet.call(this, '/secure-auth/config/states', { countryCode })) as LabelValue[]) ?? [];
		statesCache.set(countryCode, states);
		return states;
	};

	const resolveAddress = async (address: IDataObject | undefined): Promise<IDataObject | undefined> => {
		if (!address || typeof address !== 'object') return address;

		// Unwrap the fixedCollection `details` wrapper if present (nested Address).
		let flat = address as IDataObject;
		if ('details' in flat && flat.details && typeof flat.details === 'object') {
			flat = { ...(flat.details as IDataObject) };
		}

		const countryCode = (flat.countryCode as string | undefined) ?? '';
		if (countryCode && !flat.country) {
			const countries = await fetchCountries();
			const match = countries.find((c) => c.value === countryCode);
			if (match) flat.country = match.label;
		}

		const stateCode = (flat.stateCode as string | undefined) ?? '';
		if (stateCode && !flat.state && countryCode) {
			const states = await fetchStates(countryCode);
			const match = states.find((s) => s.value === stateCode);
			if (match) flat.state = match.label;
		}

		return flat;
	};

	if (body.address) {
		body.address = (await resolveAddress(body.address as IDataObject)) ?? body.address;
	}

	if (Array.isArray(body.remitToInfos)) {
		const resolved = await Promise.all(
			(body.remitToInfos as IDataObject[]).map(async (remit) => {
				if (remit?.address) {
					remit.address = (await resolveAddress(remit.address as IDataObject)) ?? remit.address;
				}
				return remit;
			}),
		);
		body.remitToInfos = resolved;
	}

	requestOptions.body = body;
	return requestOptions;
}

async function httpGet(
	this: IExecuteSingleFunctions,
	endpoint: string,
	qs: IDataObject = {},
): Promise<unknown> {
	return this.helpers.httpRequestWithAuthentication.call(this, 'blackbeeApi', {
		method: 'GET',
		baseURL: BLACKBEE_BASE_URL,
		url: endpoint,
		qs,
		json: true,
	});
}

// For each attachment item, read the referenced binary property from the
// incoming item, then derive and fill `originalFileName`, `size`, and a
// unique-generated `fileName` (UUID + extension). Strips `binaryPropertyName`
// from the outgoing body.
export async function resolveAttachmentFiles(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = (requestOptions.body ?? {}) as IDataObject;
	if (!body || typeof body !== 'object' || !Array.isArray(body.attachments)) {
		return requestOptions;
	}

	const itemIndex = this.getItemIndex();

	const resolved = await Promise.all(
		(body.attachments as IDataObject[]).map(async (att) => {
			const binaryPropertyName = (att.binaryPropertyName as string | undefined)?.trim();
			if (!binaryPropertyName) {
				throw new NodeOperationError(
					this.getNode(),
					'Attachment is missing the Binary Property name',
					{ itemIndex },
				);
			}

			const binary = this.helpers.assertBinaryData(binaryPropertyName) as IBinaryData;
			const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

			const originalFileName = binary.fileName ?? binaryPropertyName;
			const ext = deriveExtension(binary, originalFileName);
			const uniqueFileName = ext ? `${randomUUID()}.${ext}` : randomUUID();

			const next: IDataObject = {
				type: att.type ?? 'OTHER',
				originalFileName,
				fileName: uniqueFileName,
				size: buffer.length,
			};
			return next;
		}),
	);

	body.attachments = resolved;
	requestOptions.body = body;
	return requestOptions;
}

function deriveExtension(binary: IBinaryData, fileName: string): string {
	if (binary.fileExtension) return stripLeadingDot(binary.fileExtension);
	const fromName = fileName.includes('.') ? fileName.split('.').pop() ?? '' : '';
	if (fromName) return fromName.toLowerCase();
	// last resort — very coarse mimetype → extension
	const mime = binary.mimeType ?? '';
	const slash = mime.indexOf('/');
	return slash >= 0 ? mime.slice(slash + 1).toLowerCase() : '';
}

function stripLeadingDot(s: string): string {
	return s.startsWith('.') ? s.slice(1) : s;
}

// Reads the binary property named by the `binaryPropertyName` parameter and
// rebuilds the outgoing request as multipart/form-data with a single `file`
// part, matching the Bill API's uploadBill contract.
export async function resolveBillFile(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const itemIndex = this.getItemIndex();
	const binaryPropertyName = (
		this.getNodeParameter('binaryPropertyName', '') as string
	).trim();

	if (!binaryPropertyName) {
		throw new NodeOperationError(
			this.getNode(),
			'Bill upload is missing the Binary Property name',
			{ itemIndex },
		);
	}

	const binary = this.helpers.assertBinaryData(binaryPropertyName) as IBinaryData;
	const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

	const form = new FormData();
	form.append('file', buffer, {
		filename: binary.fileName ?? 'bill',
		contentType: binary.mimeType ?? 'application/octet-stream',
	});

	requestOptions.body = form;
	// Let form-data set its own multipart boundary; drop the node-level JSON header.
	if (requestOptions.headers) {
		for (const key of Object.keys(requestOptions.headers)) {
			if (key.toLowerCase() === 'content-type') {
				delete requestOptions.headers[key];
			}
		}
	}

	return requestOptions;
}
