import { createHash } from 'crypto';

const FileException = Jymfony.Component.HttpFoundation.File.Exception.FileException;
const File = Jymfony.Component.HttpFoundation.File.File;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Represents an HTTP response delivering a file.
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class BinaryFileResponse extends Response {
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

        /**
         * @type {Jymfony.Component.HttpFoundation.File.File}
         *
         * @protected
         */
        this._file = undefined;

        this.setFile(file, contentDisposition, autoEtag, autoLastModified);
    }

    /**
     * @inheritdoc
     */
    async prepare(request) {
        if (! this.headers.has('Content-Type')) {
            this.headers.set('Content-Type', await this._file.getMimeType());
        }

        if (this._autoLastModified && ! this.headers.has('Last-Modified')) {
            this.lastModified = this._file.modificationTime.timestamp;
        }

        if (this._autoEtag && ! this.headers.has('Etag')) {
            const p = new Promise((resolve, reject) => {
                const hash = createHash('sha256');
                const stream = this._file.content;

                stream.on('error', err => reject(err));
                stream.on('data', chunk => hash.update(chunk));
                stream.on('end', () => resolve(hash.digest('base64')));
            });

            this.setEtag(await p);
        }

        if ('HTTP/1.0' !== request.server.get('SERVER_PROTOCOL')) {
            this.protocolVersion = '1.1';
        }

        this._ensureIEOverSSLCompatibility(request);
        if (request.isMethod(Request.METHOD_HEAD)) {
            // Cf. RFC2616 14.13
            this.content = '';
        } else {
            this._setEncodingForCompression(request);
            this.content = (res) => {
                const stream = this._file.content;
                const p = new Promise((resolve, reject) => {
                    stream.on('end', resolve);
                    stream.on('error', reject);
                });

                stream.pipe(res);
                return p;
            };
        }

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
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     *
     * @throws {Jymfony.Component.HttpFoundation.File.Exception.FileException}
     */
    setFile(file, contentDisposition = null, autoEtag = false, autoLastModified = true) {
        if (! (file instanceof File)) {
            file = new File(file.toString());
        }

        if (! file.isReadable) {
            throw new FileException('File must be readable');
        }

        this._file = file;
        if (autoEtag) {
            this.setAutoEtag();
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
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     */
    setAutoEtag() {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._autoEtag = true;

        return this;
    }

    /**
     * Automatically sets the Last-Modified header according the file modification date.
     *
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     */
    setAutoLastModified() {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._autoLastModified = true;

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
