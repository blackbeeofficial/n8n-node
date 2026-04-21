import { INodeProperties } from 'n8n-workflow';
import { billOperations } from './operations';
import { uploadFields } from './upload.fields';
import { getFields } from './get.fields';
import { listFields } from './list.fields';

export { billOperations };

export const billFields: INodeProperties[] = [...uploadFields, ...getFields, ...listFields];
