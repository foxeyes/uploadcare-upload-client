import camelizeKeys from './camelizeKeys';
export class UploadcareFile {
    constructor(fileInfo, { baseCDN, defaultEffects, fileName }) {
        this.name = null;
        this.size = null;
        this.isStored = null;
        this.isImage = null;
        this.cdnUrl = null;
        this.cdnUrlModifiers = null;
        this.originalUrl = null;
        this.originalFilename = null;
        this.imageInfo = null;
        this.videoInfo = null;
        const { uuid, s3Bucket } = fileInfo;
        const urlBase = s3Bucket
            ? `https://${s3Bucket}.s3.amazonaws.com/${uuid}/${fileInfo.filename}`
            : `${baseCDN}/${uuid}/`;
        const cdnUrlModifiers = defaultEffects ? `-/${defaultEffects}` : null;
        const cdnUrl = `${urlBase}${cdnUrlModifiers || ''}`;
        const originalUrl = uuid ? urlBase : null;
        this.uuid = uuid;
        this.name = fileName || fileInfo.filename;
        this.size = fileInfo.size;
        this.isStored = fileInfo.isStored;
        this.isImage = fileInfo.isImage;
        this.cdnUrl = cdnUrl;
        this.cdnUrlModifiers = cdnUrlModifiers;
        this.originalUrl = originalUrl;
        this.originalFilename = fileInfo.originalFilename;
        this.imageInfo = camelizeKeys(fileInfo.imageInfo);
        this.videoInfo = camelizeKeys(fileInfo.videoInfo);
    }
}
