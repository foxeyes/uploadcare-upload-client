export class UploadClientError extends Error {
    constructor(message, request, response, headers) {
        super();
        this.name = 'UploadClientError';
        this.message = message;
        this.request = request;
        this.response = response;
        this.headers = headers;
        Object.setPrototypeOf(this, UploadClientError.prototype);
    }
}
export const cancelError = (message = 'Request canceled') => {
    const error = new UploadClientError(message);
    error.isCancel = true;
    return error;
};
