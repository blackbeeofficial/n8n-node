import { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { blackbeeApiRequest } from '../GenericFunctions';

type LabelValue = { label: string; value: string };

const PAGE_SIZE = 50;

async function paginatedSearch(
	this: ILoadOptionsFunctions,
	endpoint: string,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? Number(paginationToken) : 1;
	const res = (await blackbeeApiRequest.call(this, 'POST', endpoint, {}, {
		page,
		count: PAGE_SIZE,
		searchTerm: filter ?? '',
	})) as LabelValue[];

	const results = (res ?? []).map((i) => ({ name: i.label, value: i.value }));
	const next = results.length === PAGE_SIZE ? String(page + 1) : undefined;
	return { results, paginationToken: next };
}

export async function searchGlCodes(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return paginatedSearch.call(this, '/masterdata-api/coa/label-value', filter, paginationToken);
}

export async function searchBusinessUnits(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return paginatedSearch.call(
		this,
		'/masterdata-api/corp/segment/label-value',
		filter,
		paginationToken,
	);
}
