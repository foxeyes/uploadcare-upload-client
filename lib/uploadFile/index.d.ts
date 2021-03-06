import CancelController from '../tools/CancelController';
import { Url, Uuid } from '../api/types';
import { NodeFile, BrowserFile } from '../request/types';
import { UploadcareFile } from '../tools/UploadcareFile';
export declare type FileFromOptions = {
    publicKey: string;
    fileName?: string;
    baseURL?: string;
    secureSignature?: string;
    secureExpire?: string;
    store?: boolean;
    cancel?: CancelController;
    onProgress?: ({ value: number }: {
        value: any;
    }) => void;
    source?: string;
    integration?: string;
    retryThrottledRequestMaxTimes?: number;
    contentType?: string;
    multipartChunkSize?: number;
    baseCDN?: string;
};
/**
 * Uploads file from provided data.
 * @param data
 * @param options
 * @param [options.publicKey]
 * @param [options.fileName]
 * @param [options.baseURL]
 * @param [options.secureSignature]
 * @param [options.secureExpire]
 * @param [options.store]
 * @param [options.cancel]
 * @param [options.onProgress]
 * @param [options.source]
 * @param [options.integration]
 * @param [options.retryThrottledRequestMaxTimes]
 */
export default function uploadFile(data: NodeFile | BrowserFile | Url | Uuid, { publicKey, fileName, baseURL, secureSignature, secureExpire, store, cancel, onProgress, source, integration, retryThrottledRequestMaxTimes, contentType, multipartChunkSize, baseCDN }: FileFromOptions): Promise<UploadcareFile>;
