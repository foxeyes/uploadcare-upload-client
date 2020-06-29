import defaultSettings from './defaultSettings';
import base from './api/base';
import info from './api/info';
import fromUrl from './api/fromUrl';
import fromUrlStatus from './api/fromUrlStatus';
import group from './api/group';
import groupInfo from './api/groupInfo';
import multipartStart from './api/multipartStart';
import multipartComplete from './api/multipartComplete';
import multipartUpload from './api/multipartUpload';
import uploadFile from './uploadFile';
import uploadFileGroup from './uploadFileGroup';
/**
 * Populate options with settings.
 */
const populateOptionsWithSettings = (options, settings) => ({
    ...settings,
    ...options
});
class UploadClient {
    constructor(settings = {}) {
        this.settings = Object.assign({}, defaultSettings, settings);
    }
    updateSettings(newSettings = {}) {
        this.settings = Object.assign(this.settings, newSettings);
    }
    getSettings() {
        return this.settings;
    }
    base(file, options) {
        const settings = this.getSettings();
        return base(file, populateOptionsWithSettings(options, settings));
    }
    info(uuid, options) {
        const settings = this.getSettings();
        return info(uuid, populateOptionsWithSettings(options, settings));
    }
    fromUrl(sourceUrl, options) {
        const settings = this.getSettings();
        return fromUrl(sourceUrl, populateOptionsWithSettings(options, settings));
    }
    fromUrlStatus(token, options) {
        const settings = this.getSettings();
        return fromUrlStatus(token, populateOptionsWithSettings(options, settings));
    }
    group(uuids, options) {
        const settings = this.getSettings();
        return group(uuids, populateOptionsWithSettings(options, settings));
    }
    groupInfo(id, options) {
        const settings = this.getSettings();
        return groupInfo(id, populateOptionsWithSettings(options, settings));
    }
    multipartStart(size, options) {
        const settings = this.getSettings();
        return multipartStart(size, populateOptionsWithSettings(options, settings));
    }
    multipartUpload(part, url, options) {
        const settings = this.getSettings();
        return multipartUpload(part, url, populateOptionsWithSettings(options, settings));
    }
    multipartComplete(uuid, options) {
        const settings = this.getSettings();
        return multipartComplete(uuid, populateOptionsWithSettings(options, settings));
    }
    uploadFile(data, options) {
        const settings = this.getSettings();
        return uploadFile(data, populateOptionsWithSettings(options, settings));
    }
    uploadFileGroup(data, options) {
        const settings = this.getSettings();
        return uploadFileGroup(data, populateOptionsWithSettings(options, settings));
    }
}
export default UploadClient;
