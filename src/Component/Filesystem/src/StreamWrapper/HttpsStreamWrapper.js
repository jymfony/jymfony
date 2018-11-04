const HttpStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.HttpStreamWrapper;

/**
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
class HttpsStreamWrapper extends HttpStreamWrapper {
    get protocol() {
        return 'https';
    }
}

module.exports = HttpsStreamWrapper;
