const FileException = Jymfony.Component.HttpFoundation.File.Exception.FileException;
const File = Jymfony.Component.HttpFoundation.File.File;
const Response = Jymfony.Component.HttpFoundation.Response;

const crypto = require('crypto');

/**
 * Represents an HTTP response delivering a file.
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
class BinaryFileResponse extends Response {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpFoundation.File.File|string} file
     * @param {int} [status = Jymfony.Component.HttpFoundation.Response.HTTP_OK]
     * @param {Object} [headers = {}]
     * @param {boolean} [isPublic = true]
     * @param {string} [contentDisposition = null]
     * @param {boolean} [autoEtag = false]
     * @param {boolean} [autoLastModified = true]
     */
    __construct(file, status = __self.HTTP_OK, headers = {}, isPublic = true, contentDisposition = null, autoEtag = false, autoLastModified = true) {
        super.__construct('', status, headers);

        if (isPublic) {
            this.setPublic();
        }

        return this.setFile(file, contentDisposition, autoEtag, autoLastModified);
    }

    /**
     * @inheritdoc
     */
    set content(content) {
        super.content = content;
    }

    /**
     * @inheritdoc
     */
    get content() {
        return (res) => {
            const stream = this._file.content;
            const p = new Promise(((resolve, reject) => {
                stream.on('end', resolve);
                stream.on('error', reject);
            }));

            stream.pipe(res, { end: false });
            return p;
        };
    }

    /**
     * @inheritdoc
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    prepare(request) {
        if (! this.headers.has('Content-Type')) {
            this.headers.set('Content-Type', this._file.getMimeType() || 'application/octet-stream');
        }

        if ('HTTP/1.0' !== request.server.get('SERVER_PROTOCOL')) {
            this.protocolVersion = '1.1';
        }

        this._ensureIEOverSSLCompatibility(request);
        const fileSize = this._file.size;

        if (false === fileSize) {
            return this;
        }

        this.headers.set('Content-Length', fileSize);

        return this;
    }

    /**
     * Sets the file to stream.
     *
     * @param {Jymfony.Component.HttpFoundation.File.File|string} file
     * @param {string} contentDisposition
     * @param {boolean} autoEtag
     * @param {boolean} autoLastModified
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.BinaryFileResponse>}
     *
     * @throws {Jymfony.Component.HttpFoundation.File.Exception.FileException}
     */
    async setFile(file, contentDisposition = null, autoEtag = false, autoLastModified = true) {
        if (! (file instanceof File)) {
            file = new File(file.toString());
        }

        if (! file.isReadable) {
            throw new FileException('File must be readable');
        }

        /**
         * @type {Jymfony.Component.HttpFoundation.File.File}
         *
         * @protected
         */
        this._file = file;

        if (autoEtag) {
            await this.setAutoEtag();
        }

        if (autoLastModified) {
            this.setAutoLastModified();
        }

        if (contentDisposition) {
            this.setContentDisposition(contentDisposition);
        }

        return this;
    }

    /**
     * Automatically sets the ETag header according to the checksum of the file.
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.BinaryFileResponse>}
     */
    async setAutoEtag() {
        const p = new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = this._file.content;

            stream.on('error', err => reject(err));
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('base64')));
        });

        this.setEtag(await p);

        return this;
    }

    /**
     * Automatically sets the Last-Modified header according the file modification date.
     *
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     */
    setAutoLastModified() {
        this.lastModified = this._file.modificationTime.timestamp;

        return this;
    }

    /**
     * Sets the Content-Disposition header with the given filename.
     *
     * @param {string} disposition ResponseHeaderBag::DISPOSITION_INLINE or ResponseHeaderBag::DISPOSITION_ATTACHMENT
     * @param {string} filename Optionally use this UTF-8 encoded filename instead of the real name of the file
     * @param {string} filenameFallback A fallback filename, containing only ASCII characters. Defaults to an automatically encoded filename
     *
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     */
    setContentDisposition(disposition, filename = '', filenameFallback = '') {
        if ('' === filename) {
            filename = this._file.fileName;
        }

        if ('' === filenameFallback && (! filename.match(/^[\x20-\x7e]*$/) || -1 !== filename.indexOf('%'))) {
            filenameFallback = filename.replace(/([^\x20-\x7e]|%)/g, '_');
        }

        const dispositionHeader = this.headers.makeDisposition(disposition, filename, filenameFallback);
        this.headers.set('Content-Disposition', dispositionHeader);

        return this;
    }
}

module.exports = BinaryFileResponse;
