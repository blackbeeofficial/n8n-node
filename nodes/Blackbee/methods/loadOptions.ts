import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { blackbeeApiRequest } from '../GenericFunctions';

type LabelValue = { label: string; value: string };

const toOptions = (items: LabelValue[]): INodePropertyOptions[] =>
	items.map((i) => ({ name: i.label, value: i.value }));

// Currencies — GET /masterdata-api/label-values?type=CURRENCY_CODE → plain array
export async function getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const res = (await blackbeeApiRequest.call(this, 'GET', '/masterdata-api/label-values', {
		type: 'CURRENCY_CODE',
	})) as LabelValue[];
	return toOptions(res ?? []);
}

// Countries — GET /secure-auth/config/countries → plain array
export async function getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const res = (await blackbeeApiRequest.call(
		this,
		'GET',
		'/secure-auth/config/countries',
	)) as LabelValue[];
	return toOptions(res ?? []);
}

// All states across every supported country — single call to
// GET /secure-auth/config/states with no countryCode query param, which the
// backend treats as "return everything". Used by the remit-to stateCode
// dropdown where n8n's load-options callback can't scope itself to the
// currently-edited array item, so we can't derive the sibling countryCode.
// State values are backend-internal IDs assumed to be globally unique.
export async function getAllStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const states = (await blackbeeApiRequest.call(
		this,
		'GET',
		'/secure-auth/config/states',
	)) as LabelValue[];
	return toOptions(states ?? []);
}

// States — GET /secure-auth/config/states?countryCode=<code> → plain array.
// Depends on the sibling countryCode field in the same Address collection.
// When no country is selected we surface a hint option so the dropdown isn't
// silently empty. The value is '' so the node's `required: true` on stateCode
// still blocks execution if the user tries to submit without choosing a real
// state.
export async function getStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const countryCode = resolveCountryCode.call(this);
	if (!countryCode) {
		return [
			{
				name: '⚠ Select a Country First',
				value: '',
				description: 'State options appear after you choose a Country in this address',
			},
		];
	}
	const res = (await blackbeeApiRequest.call(this, 'GET', '/secure-auth/config/states', {
		countryCode,
	})) as LabelValue[];
	const options = toOptions(res ?? []);
	if (options.length === 0) {
		return [
			{
				name: 'ℹ No States Available for the Selected Country',
				value: '',
				description: 'The backend returned no states for this country',
			},
		];
	}
	return options;
}

// Vendor setup list endpoints — all share GET /ap-api/vendor-setup/label-value?type=<X>
// and return `{ list: LabelValue[] }`.
async function getVendorSetupList(
	this: ILoadOptionsFunctions,
	type: string,
): Promise<INodePropertyOptions[]> {
	const res = (await blackbeeApiRequest.call(this, 'GET', '/ap-api/vendor-setup/label-value', {
		type,
	})) as { list?: LabelValue[] };
	return toOptions(res?.list ?? []);
}

export async function getVendorTypes(this: ILoadOptionsFunctions) {
	return getVendorSetupList.call(this, 'VENDOR_TYPE');
}

export async function getNetTerms(this: ILoadOptionsFunctions) {
	return getVendorSetupList.call(this, 'NET_TERMS');
}

export async function getPaymentModes(this: ILoadOptionsFunctions) {
	return getVendorSetupList.call(this, 'PAYMENT_MODE');
}

// Helper — walk the likely parameter paths to find the selected countryCode.
// Supports the top-level `additionalFields.address.details.countryCode`
// (Create Vendor) and the nested
// `additionalFields.remitToInfos.item[i].address.details.countryCode`
// (n8n's load-options scope varies by call site and doesn't expose the
// active remit-to index, so we fall back to the first remit-to item that
// has a countryCode set).
function resolveCountryCode(this: ILoadOptionsFunctions): string {
	const candidates: string[] = [
		'&countryCode',
		'countryCode',
		'details.countryCode',
		'address.details.countryCode',
		'additionalFields.address.details.countryCode',
	];
	for (const path of candidates) {
		try {
			const v = this.getCurrentNodeParameter(path) as string | undefined;
			if (v) return v;
		} catch {
			// next path
		}
	}
	try {
		const additional = this.getCurrentNodeParameter('additionalFields') as
			| {
					address?: { details?: { countryCode?: string } };
					remitToInfos?: {
						item?: Array<{ address?: { details?: { countryCode?: string } } }>;
					};
			  }
			| undefined;
		const top = additional?.address?.details?.countryCode;
		if (top) return top;
		const items = additional?.remitToInfos?.item ?? [];
		for (const it of items) {
			const v = it?.address?.details?.countryCode;
			if (v) return v;
		}
	} catch {
		// ignore
	}
	try {
		const addr = this.getCurrentNodeParameter('address') as
			| { details?: { countryCode?: string } }
			| undefined;
		if (addr?.details?.countryCode) return addr.details.countryCode;
	} catch {
		// ignore
	}
	return '';
}
