import { INodeProperties } from 'n8n-workflow';
import { billOperations } from './operations';
import { uploadFields } from './upload.fields';

export { billOperations };

export const billFields: INodeProperties[] = [...uploadFields];
