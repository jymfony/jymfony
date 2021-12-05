const DateTime = Jymfony.Component.DateTime.DateTime;
const Cookie = Jymfony.Component.HttpFoundation.Cookie;
const HeaderBag = Jymfony.Component.HttpFoundation.HeaderBag;
const HeaderUtils = Jymfony.Component.HttpFoundation.HeaderUtils;

/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class ResponseHeaderBag extends HeaderBag {
    /**
     * Constructor.
     *
     * @param {Object} [headers = {}]
     */
    __construct(headers = {}) {
        /**
         * Define the case of header names.
         *
         * @type {Object.<string, string>}
         *
         * @protected
         */
        this._headerNames = {};

        /**
         * Cookies of the response.
         *
         * @type {Object.<Object.<Object.<Jymfony.Component.HttpFoundation.Cookie>>>}
         *
         * @private
         */
        this._cookies = {};

        /**
         * Computed cache-control header.
         *
         * @type {Object.<string, int|string|boolean>}
         *
         * @private
         */
        this._computedCacheControl = {};

        super.__construct(headers);

        if (! this.has('cache-control')) {
            this.set('Cache-Control', '');
        }

        /* RFC2616 - 14.18 says all Responses need to have a Date */
        if (! this.has('date')) {
            this._initDate();
        }
    }

    /**
     * @inheritdoc
     */
    replace(headers = {}) {
        this._headerNames = {};
        this._cookies = {};

        super.replace(headers);

        if (! this._headers['cache-control']) {
            this.set('Cache-Control', '');
        }

        if (! this._headers['date']) {
            this._initDate();
        }
    }

    /**
     * @inheritdoc
     */
    get all() {
        const headers = super.all;

        headers['set-cookie'] = [];
        for (const cookie of this.getCookies()) {
            headers['set-cookie'].push(String(cookie));
        }

        return headers;
    }

    /**
     * @inheritdoc
     */
    set(key, values, replace = true) {
        const uniqueKey = key.toLowerCase().replace('_', '-');
        this._headerNames[uniqueKey] = key;

        if ('set-cookie' === uniqueKey) {
            if (replace) {
                this._cookies = {};
            }

            if (! isArray(values)) {
                values = [ values ];
            }

            for (const cookie of values) {
                this.setCookie(Cookie.fromString(cookie));
            }

            return;
        }

        super.set(key, values, replace);

        // Ensure the cache-control header has sensible defaults
        if (-1 !== [ 'cache-control', 'etag', 'last-modified', 'expires' ].indexOf(uniqueKey)) {
            const computed = this._computeCacheControlValue();
            this._headers['cache-control'] = [ computed ];
            this._headerNames['cache-control'] = 'Cache-Control';
            this._computedCacheControl = this._parseCacheControl(computed);
        }
    }

    /**
     * @inheritdoc
     */
    hasCacheControlDirective(key) {
        return undefined !== this._computedCacheControl[key];
    }

    /**
     * @inheritdoc
     */
    getCacheControlDirective(key) {
        return this._computedCacheControl[key];
    }

    /**
     * Sets a cookie.
     *
     * @param {Jymfony.Component.HttpFoundation.Cookie} cookie
     */
    setCookie(cookie) {
        let domain = cookie.domain;
        if (null === domain || undefined === domain) {
            domain = '';
        }

        this._cookies[domain] = this._cookies[domain] || {};
        this._cookies[domain][cookie.path] = this._cookies[domain][cookie.path] || {};
        this._cookies[domain][cookie.path][cookie.name] = cookie;

        this._headerNames['set-cookie'] = 'Set-Cookie';
    }

    /**
     * Removes a cookie from the array, but does not unset it in the browser.
     */
    removeCookie(name, path = '/', domain = undefined) {
        if (null === domain || undefined === domain) {
            domain = '';
        }

        if (! path) {
            path = '/';
        }

        delete this._cookies[domain][path][name];

        if (this._cookies[domain] && this._cookies[domain][path] && 0 === Object.values(this._cookies[domain][path]).length) {
            delete this._cookies[domain][path];

            if (0 === Object.values(this._cookies[domain]).length) {
                delete this._cookies[domain];
            }
        }

        if (0 === Object.values(this._cookies).length) {
            delete this._headerNames['set-cookie'];
        }
    }

    /**
     * Returns an array with all cookies.
     *
     * @returns {Jymfony.Component.HttpFoundation.Cookie[]}
     *
     * @throws {InvalidArgumentException} When the format is invalid
     */
    getCookies(format = __self.COOKIES_FLAT) {
        if (! [ __self.COOKIES_FLAT, __self.COOKIES_ARRAY ].includes(format)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Format "%s" invalid (%s).', format, [ __self.COOKIES_FLAT, __self.COOKIES_ARRAY ].join(', ')));
        }

        if (__self.COOKIES_ARRAY === format) {
            return { ...this._cookies };
        }

        const flattenedCookies = [];
        for (const path of Object.values(this._cookies)) {
            for (const cookies of Object.values(path)) {
                for (const cookie of Object.values(cookies)) {
                    flattenedCookies.push(cookie);
                }
            }
        }

        return flattenedCookies;
    }

    /**
     * @inheritdoc
     */
    remove(key) {
        const uniqueKey = key.toLowerCase().replace(/_/g, '-');
        delete this._headerNames[uniqueKey];

        if ('set-cookie' === uniqueKey) {
            this._cookies = {};

            return;
        }

        super.remove(key);

        if ('cache-control' === uniqueKey) {
            this._computedCacheControl = {};
        }

        if ('date' === uniqueKey) {
            this._initDate();
        }
    }

    /**
     * Generates a HTTP Content-Disposition field-value.
     *
     * @param {string} disposition One of "inline" or "attachment"
     * @param {string} filename A unicode string
     * @param {string} filenameFallback A string containing only ASCII characters that
     *                                  is semantically equivalent to $filename. If the filename is already ASCII,
     *                                  it can be omitted, or just copied from $filename
     *
     * @returns {string} A string suitable for use as a Content-Disposition field-value
     *
     * @throws {InvalidArgumentException}
     *
     * @see RFC 6266
     */
    makeDisposition(disposition, filename, filenameFallback = '') {
        if (disposition !== __self.DISPOSITION_ATTACHMENT && disposition !== __self.DISPOSITION_INLINE) {
            throw new InvalidArgumentException(__jymfony.sprintf('The disposition must be either "%s" or "%s".', __self.DISPOSITION_ATTACHMENT, __self.DISPOSITION_INLINE));
        }

        if (! filenameFallback) {
            filenameFallback = filename;
        }

        // FilenameFallback is not ASCII.
        if (! filenameFallback.match(/^[\x20-\x7e]*$/)) {
            throw new InvalidArgumentException('The filename fallback must only contain ASCII characters.');
        }

        // Percent characters aren't safe in fallback.
        if (-1 !== filenameFallback.indexOf('%')) {
            throw new InvalidArgumentException('The filename fallback cannot contain the "%" character.');
        }

        // Path separators aren't allowed in either.
        if (-1 !== filename.indexOf('/') || -1 !== filename.indexOf('\\') || -1 !== filenameFallback.indexOf('/') || -1 !== filenameFallback.indexOf('\\')) {
            throw new InvalidArgumentException('The filename and the fallback cannot contain the "/" and "\\" characters.');
        }

        const params = { filename: filenameFallback };
        if (filenameFallback !== filename) {
            params['filename*'] = 'utf-8\'\''+encodeURIComponent(filename);
        }

        return disposition + '; ' + HeaderUtils.toString(params, ';');
    }

    /**
     * Returns the calculated value of the cache-control header.
     *
     * This considers several other headers and calculates or modifies the
     * cache-control header to a sensible, conservative value.
     *
     * @returns {string}
     *
     * @protected
     */
    _computeCacheControlValue() {
        const cacheControlEmpty = 0 === Object.keys(this._cacheControl).length;
        if (cacheControlEmpty && ! this.has('ETag') && ! this.has('Last-Modified') && ! this.has('Expires')) {
            return 'no-cache, private';
        }

        if (cacheControlEmpty) {
            // Conservative by default
            return 'private, must-revalidate';
        }

        const header = this.cacheControlHeader;
        if (this._cacheControl.public || this._cacheControl.private) {
            return header;
        }

        // Public if s-maxage is defined, private otherwise
        if (! this._cacheControl['s-maxage']) {
            return header + ', private';
        }

        return header;
    }

    /**
     * @private
     */
    _initDate() {
        const now = new DateTime(undefined, 'UTC');
        this.set('Date', now.format('D, d M Y H:i:s')+' GMT');
    }
}

Object.defineProperty(ResponseHeaderBag, 'DISPOSITION_ATTACHMENT', { writable: false, enumerable: true, configurable: true, value: 'attachment' });
Object.defineProperty(ResponseHeaderBag, 'DISPOSITION_INLINE', { writable: false, enumerable: true, configurable: true, value: 'inline' });

Object.defineProperty(ResponseHeaderBag, 'COOKIES_FLAT', { writable: false, enumerable: true, configurable: true, value: 'flat' });
Object.defineProperty(ResponseHeaderBag, 'COOKIES_ARRAY', { writable: false, enumerable: true, configurable: true, value: 'array' });
