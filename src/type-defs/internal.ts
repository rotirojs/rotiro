import {RestMethods} from './index';

export interface ExtractedRequestDetail { method: RestMethods; body: any; fullPath: string }
