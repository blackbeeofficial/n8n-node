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

// States — GET /secure-auth/config/states?countryCode=<code> → plain array.
// Depends on the sibling countryCode field in the same Address collection.
export async function getStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const countryCode = resolveCountryCode.call(this);
	if (!countryCode) return [];
	const res = (await blackbeeApiRequest.call(this, 'GET', '/secure-auth/config/states', {
		countryCode,
	})) as LabelValue[];
	return toOptions(res ?? []);
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
// Supports both top-level `address.details.countryCode` and the nested
// `remitToInfos.item[i].address.details.countryCode` (n8n's load-options scope
// varies by call site).
function resolveCountryCode(this: ILoadOptionsFunctions): string {
	const candidates: string[] = [
		'countryCode',
		'details.countryCode',
		'address.details.countryCode',
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
		const addr = this.getCurrentNodeParameter('address') as
			| { details?: { countryCode?: string } }
			| undefined;
		if (addr?.details?.countryCode) return addr.details.countryCode;
	} catch {
		// ignore
	}
	return '';
}
