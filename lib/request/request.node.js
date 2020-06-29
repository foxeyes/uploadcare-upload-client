import * as http from 'http';
import * as https from 'https';
import { parse } from 'url';
import { Readable, Transform } from 'stream';
import { cancelError } from '../tools/errors';
// ProgressEmitter is a simple PassThrough-style transform stream which keeps
// track of the number of bytes which have been piped through it and will
// invoke the `onprogress` function whenever new number are available.
class ProgressEmitter extends Transform {
    constructor(onProgress, size) {
        super();
        this._onprogress = onProgress;
        this._position = 0;
        this.size = size;
    }
    _transform(chunk, encoding, callback) {
        this._position += chunk.length;
        this._onprogress({ value: this._position / this.size });
        callback(null, chunk);
    }
}
const getLength = (formData) => new Promise((resolve, reject) => {
    formData.getLength((error, length) => {
        if (error)
            reject(error);
        else
            resolve(length);
    });
});
function isFormData(formData) {
    if (formData && formData.toString() === '[object FormData]') {
        return true;
    }
    return false;
}
function isReadable(data, isFormData) {
    if (data && (data instanceof Readable || isFormData)) {
        return true;
    }
    return false;
}
const request = (params) => {
    const { method = 'GET', url, data, headers = {}, cancel, onProgress } = params;
    return Promise.resolve()
        .then(() => {
        if (isFormData(data)) {
            return getLength(data);
        }
        else {
            return undefined;
        }
    })
        .then(length => new Promise((resolve, reject) => {
        const isFormData = !!length;
        let aborted = false;
        const options = parse(url);
        options.method = method;
        options.headers = isFormData
            ? Object.assign(data.getHeaders(), headers)
            : headers;
        if (isFormData || (data && data.length)) {
            options.headers['Content-Length'] =
                length || data.length;
        }
        const req = options.protocol !== 'https:'
            ? http.request(options)
            : https.request(options);
        if (cancel) {
            cancel.onCancel(() => {
                aborted = true;
                req.abort();
                reject(cancelError());
            });
        }
        req.on('response', res => {
            if (aborted)
                return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resChunks = [];
            res.on('data', data => {
                resChunks.push(data);
            });
            res.on('end', () => resolve({
                data: Buffer.concat(resChunks).toString('utf8'),
                status: res.statusCode,
                headers: res.headers,
                request: params
            }));
        });
        req.on('error', err => {
            if (aborted)
                return;
            reject(err);
        });
        if (isReadable(data, isFormData)) {
            if (onProgress && length) {
                data.pipe(new ProgressEmitter(onProgress, length)).pipe(req);
            }
            else {
                data.pipe(req);
            }
        }
        else {
            req.end(data);
        }
    }));
};
export default request;
