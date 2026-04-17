import { INodeProperties } from 'n8n-workflow';
import { vendorOperations } from './operations';
import { getFields } from './get.fields';
import { createFields } from './create.fields';
import { listFields } from './list.fields';

export { vendorOperations };

export const vendorFields: INodeProperties[] = [
	...getFields,
	...createFields,
	...listFields,
];
