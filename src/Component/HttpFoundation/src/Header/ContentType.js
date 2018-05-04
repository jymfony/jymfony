const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;
const httpTokenCodePointRegex = /^[!#$%&'*+\-.^_`|~a-z0-9]+$/i;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Header
 */
class ContentType {
    /**
     * Constructor.
     *
     * @param {string} contentType
     */
    __construct(contentType) {
        this._parse(contentType);
    }

    /**
     * Gets the content type (ex: text, application, multipart, ...)
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * Gets the content subtype (ex: html, plain, json, ...)
     *
     * @returns {string}
     */
    get subtype() {
        return this._subtype;
    }

    /**
     * The MIME content type (text/html, application/json, ...)
     *
     * @returns {string}
     */
    get essence() {
        return this._type + '/' + this._subtype;
    }

    /**
     * Gets a content type parameter (ex: charset).
     *
     * @param {string} parameter
     * @param {undefined|string} [defaultValue]
     *
     * @returns {string}
     */
    get(parameter, defaultValue = undefined) {
        return this._parameters[parameter] || defaultValue;
    }

    /**
     * Parses and validates the the content-type header.
     *
     * @param {string} contentType
     *
     * @protected
     */
    _parse(contentType) {
        const [ t, ...params ] = contentType.split(';')
            .map(str => __jymfony.trim(str.toLowerCase()));
        const [ type, subtype ] = t.split('/', 2);

        if (! type.match(httpTokenCodePointRegex) || ! subtype.match(httpTokenCodePointRegex)) {
            throw new BadRequestException('Invalid content type');
        }

        this._type = type;
        this._subtype = subtype;

        this._parameters = params.map(str => str.split('=', 2).map(str => __jymfony.trim(str)))
            .reduce((res, val) => (res[val[0]] = val[1], res), {});
    }
}

module.exports = ContentType;
