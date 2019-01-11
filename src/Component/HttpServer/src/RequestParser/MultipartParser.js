const UploadedFile = Jymfony.Component.HttpFoundation.File.UploadedFile;
const ContentDisposition = Jymfony.Component.HttpFoundation.Header.ContentDisposition;
const ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
const AbstractParser = Jymfony.Component.HttpServer.RequestParser.AbstractParser;
const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 *
 * @internal
 *
 * @final
 */
class MultipartParser extends AbstractParser {
    /**
     * Constructor.
     *
     * @param {stream.Duplex} stream
     * @param {Jymfony.Component.HttpFoundation.Header.ContentType} contentType
     * @param {undefined|int} contentLength
     */
    __construct(stream, contentType, contentLength) {
        if ('form-data' !== contentType.subtype) {
            throw new BadRequestException('Multipart requests must have "form-data" subtype');
        }

        /**
         * Multipart boundary
         *
         * @type {string}
         *
         * @private
         */
        this._boundary = contentType.get('boundary');

        super.__construct(stream, contentLength);
    }

    /**
     * @inheritdoc
     */
    decode(buffer) {
        const params = [];

        [ buffer ] = buffer.split('--' + this._boundary + '--', 2);
        const parts = buffer.split('--' + this._boundary + '\r\n')
            .map(str => str.replace(/\r\n$/, ''))
            .filter(str => str.length);

        for (const part of parts) {
            const headers = {};
            const regexp = /(.*)\r\n/g;
            let body = '';

            let match;
            while (match = regexp.exec(part)) {
                if (0 === match[1].length) {
                    const idx = match.index;
                    body = part.substr(idx + 2);
                    break;
                }

                const hdr = this._parseHeader(match[1]);
                headers[hdr[0]] = hdr[1];
            }

            if (undefined === headers['content-disposition']) {
                throw new BadRequestException('Content-Disposition header not present in form-data part.');
            }

            /** @type {Jymfony.Component.HttpFoundation.Header.ContentDisposition} */
            const disposition = headers['content-disposition'];
            if (! disposition.has('name')) {
                throw new BadRequestException('Content-Disposition header does not contain field name.');
            }

            const fieldName = disposition.get('name');
            if (disposition.has('filename')) {
                const contentType = headers['content-type'] || new ContentType('application/octet-stream');
                body = Buffer.from(body, 'base64' === headers['content-transfer-encoding'] ? 'base64' : 'utf8');

                params.push([ fieldName, new UploadedFile(body, disposition.get('filename'), contentType.essence) ]);
            } else {
                params.push([ fieldName, body ]);
            }
        }

        return __jymfony.internal_parse_query_string(params);
    }

    /**
     * Parse header line.
     *
     * @param {string} headerLine
     *
     * @returns {[string, *]}
     *
     * @private
     */
    _parseHeader(headerLine) {
        const hdr = headerLine.split(':')
            .map(str => __jymfony.trim(str));

        hdr[0] = hdr[0].toLowerCase();
        switch (hdr[0]) {
            case 'content-disposition':
                hdr[1] = new ContentDisposition(hdr[1]);
                break;

            case 'content-type':
                hdr[1] = new ContentType(hdr[1]);
                break;
        }

        return hdr;
    }
}

module.exports = MultipartParser;
