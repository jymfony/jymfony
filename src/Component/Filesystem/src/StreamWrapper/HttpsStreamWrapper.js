const HttpStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.HttpStreamWrapper;

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
export default class HttpsStreamWrapper extends HttpStreamWrapper {
    get protocol() {
        return 'https';
    }
}
