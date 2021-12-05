import { performance } from 'perf_hooks';

const CommonResponseTrait = Jymfony.Component.HttpClient.Response.CommonResponseTrait;
const ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;
let idSequence = 0;

/**
 * A test-friendly response.
 *
 * @memberOf Jymfony.Component.HttpClient.Response
 */
export default class MockResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
    /**
     * @param {string|string[]|IterableIterator} body The response body as a string or an iterable of strings,
     *      yielding an empty string simulates an idle timeout, exceptions are turned to TransportException
     * @param {Object.<string, *>} info
     *
     * @see ResponseInterface.getInfo() for possible info, e.g. "response_headers"
     */
    __construct(body = '', info = {}) {
        /**
         * @type {int}
         *
         * @private
         */
        this._id = undefined;

        /**
         * @type {string|string[]|IterableIterator}
         *
         * @private
         */
        this._body = undefined !== body[Symbol.iterator] ? body : String(body);

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._info = Object.assign({}, this._info, { http_code: 200 }, info);

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._requestOptions = {};

        /**
         * @type {string}
         *
         * @private
         */
        this._requestUrl = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._requestMethod = undefined;

        /**
         * @type {Buffer}
         *
         * @private
         */
        this._buffer = undefined;

        /**
         * @returns {function(): boolean}
         *
         * @private
         */
        this._initializer = () => true;

        const headers = {};
        if (undefined !== info.response_headers) {
            const responseHeaders = [];
            for (const [ k, v ] of __jymfony.getEntries(info.response_headers)) {
                for (const vv of isArray(v) ? v : [ v ]) {
                    responseHeaders.push((isString(k) ? k + ': ' : '') + vv);
                }
            }

            this._info.response_headers = [];
            for (const h of responseHeaders) {
                let m, idx;
                if (11 <= h.length && '/' === h[4] && (m = h.matches(/^HTTP\/\d+(?:\.\d+)? ([1-9]\d\d)(?: |$)/))) {
                    this._info.info.http_code = m[1];
                } else if (-1 !== (idx = h.indexOf(':'))) {
                    const headerName = h.substr(0, idx).toLowerCase();
                    headers[headerName] = headers[headerName] || [];
                    headers[headerName].push(__jymfony.ltrim(h.substr(idx + 1)));
                }

                this._info.response_headers.push(h);
            }
        }

        /**
         * @type {Object.<string, string[]>}
         *
         * @private
         */
        this._headers = headers;

        if (! this._info.http_code) {
            throw new TransportException(__jymfony.sprintf('Invalid or missing HTTP status line for "%s".', info.url));
        }
    }

    /**
     * @inheritdoc
     */
    async getHeaders(Throw = true) {
        if (this._initializer) {
            await this._initialize();
        }

        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        if (Throw) {
            this._checkStatusCode();
        }

        return __jymfony.clone(this._headers);
    }

    /**
     * Returns the options used when doing the request.
     */
    get requestOptions() {
        return { ...this._requestOptions };
    }

    /**
     * Returns the URL used when doing the request.
     */
    get requestUrl() {
        return this._requestUrl;
    }

    /**
     * Returns the method used when doing the request.
     */
    get requestMethod() {
        return this._requestMethod;
    }

    /**
     * @inheritdoc
     */
    getInfo(type = null) {
        return null !== type ? this._info[type] || null : this._info;
    }

    /**
     * @inheritdoc
     */
    cancel() {
        this._info.canceled = true;
        this._info.error = 'Response has been canceled.';
        this._body = null;
    }

    /**
     * @inheritdoc
     */
    close() {
        this._body = [];
    }

    /**
     * @private
     */
    async _initialize() {
        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        try {
            const result = await this._initializer(this);
            if (true === result) {
                return;
            }

            const [ options, response ] = result;
            await this._perform(response, options);
        } finally {
            this._initializer = null;
        }
    }

    /**
     * @internal
     */
    static fromRequest(method, url, options, mock) {
        const response = new this([]);
        response._requestOptions = options;
        response._id = ++idSequence;
        response._initializer = response => response._body[0];

        response._info.redirect_count = 0;
        response._info.redirect_url = null;
        response._info.start_time = performance.now();
        response._info.http_method = method;
        response._info.http_code = 0;
        response._info.user_data = options.user_data === undefined ? null : options.user_data;
        response._info.url = String(url);

        if (mock instanceof this) {
            mock._requestOptions = response._requestOptions;
            mock._requestMethod = method;
            mock._requestUrl = url;
        }

        this._writeRequest(response, options, mock);
        response._body.push([ options, mock ]);

        return response;
    }

    /**
     * @inheritdoc
     */
    async getContent(Throw = true) {
        if (this._initializer) {
            await this._initialize();
        }

        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        if (Throw) {
            this._checkStatusCode();
        }

        if (true === this._requestOptions.buffer || undefined === this._requestOptions.buffer) {
            if (this._buffer) {
                return this._buffer;
            }

            const stream = new __jymfony.StreamBuffer();
            try {
                await this._pipeline(this._body, stream);
            } catch (e) {
                this._info.error = e.message;
                throw new TransportException(e.message, 0, e);
            }

            return this._buffer = stream.buffer;
        }

        if (false === this._requestOptions.buffer) {
            return this._body;
        }

        if (null === this._body) {
            throw new TransportException('Cannot get the content of the response twice: buffering is disabled.');
        }

        try {
            return this._pipeline(this._body, this._requestOptions.buffer);
        } finally {
            this._body = null;
        }
    }

    /**
     * @inheritdoc
     */
    async _perform(response, options) {
        const onProgress = options.on_progress || (() => {});

        // Populate info related to headers
        const info = Object.assign({}, this.getInfo() || {}, response.getInfo() || {});
        info.http_code = await response.getStatusCode() || 200;
        info.response_headers = [];

        const headers = {};
        for (const h of (info.response_headers || [])) {
            const idx = h.indexOf(':');
            if (-1 !== idx) {
                const headerName = h.substr(0, idx).toLowerCase();
                headers[headerName] = headers[headerName] || [];
                headers[headerName] = __jymfony.ltrim(h.substr(idx + 1));
            }

            info.response_headers.push(h);
        }

        this._headers = headers;

        const dlSize = undefined !== response._headers['content-encoding'] || 'HEAD' === info.http_method || [ 204, 304 ].includes(info.http_code) ? 0 : (response._headers['content-length'] ? ~~response._headers['content-length'][0] : 0);
        Object.assign(this._info = {
            start_time: response._info.start_time,
            user_data: response._info.user_data,
            http_code: response._info.http_code,
        }, info, this._info);

        if (undefined !== response._info.total_time) {
            this._info.total_time = performance.now() - response._info.start_time;
        }

        this._headers = response._headers;

        // "notify" headers arrival
        onProgress(0, dlSize, this._info);

        // Cast response body to activity list
        let body = response instanceof MockResponse ? response._body : await response.getContent(false);
        if (isString(body)) {
            body = Buffer.from(body);
        }

        let offset = 0;
        this._body = new __jymfony.StreamBuffer();
        if (! isBuffer(body)) {
            await __jymfony.forAwait(body, async chunk => {
                if (0 === chunk.length) {
                    // Simulate an idle timeout
                    throw new TransportException(__jymfony.sprintf('Idle timeout reached for "%s".', response._info.url));
                } else {
                    await (new Promise((res, rej) => {
                        this._body.write(chunk, err => {
                            if (err) {
                                rej(err);
                            }

                            res();
                        });
                    }));

                    offset += chunk.length;

                    // "notify" download progress
                    onProgress(offset, dlSize, this._info);
                }
            });
        } else {
            offset += body.length;
            await (new Promise((res, rej) => {
                this._body.write(body, err => {
                    if (err) {
                        rej(err);
                    }

                    res();
                });
            }));
        }

        if (undefined !== response._info.total_time) {
            response._info.total_time = performance.now() - response._info.start_time;
        }

        // "notify" completion
        onProgress(offset, dlSize, response._info);
        if (dlSize && offset !== dlSize) {
            throw new TransportException(__jymfony.sprintf('Transfer closed with %d bytes remaining to read.', dlSize - offset));
        }
    }

    /**
     * Simulates sending the request.
     *
     * @private
     */
    static async _writeRequest(response, options, mock) {
        const onProgress = options.on_progress || (() => {});
        response._info = Object.assign({}, mock.getInfo(), response._info || {});

        // Simulate "size_upload" if it is set
        if (undefined !== response._info.size_upload) {
            response._info.size_upload = 0.0;
        }

        // Simulate "total_time" if it is set
        if (undefined !== response._info.total_time) {
            response._info.total_time = performance.now() - response._info.start_time;
        }

        // "notify" DNS resolution
        onProgress(0, 0, response._info);

        // Consume the request body
        const body = options.body || '';
        if (isStream(body)) {
            await __jymfony.forAwait(body, chunk => {
                if (undefined !== response._info.size_upload) {
                    response._info.size_upload += chunk.length;
                }
            });
        } else if (isFunction(body)) {
            let data;
            while (null !== (data = body(16372))) {
                if (isString(data)) {
                    data = Buffer.from(data);
                }

                if (! isBuffer(data)) {
                    throw new TransportException(__jymfony.sprintf('Return value of the "body" option callback must be string or buffer, "%s" returned.', __jymfony.get_debug_type(data)));
                }

                // "notify" upload progress
                if (undefined !== response._info.size_upload) {
                    response._info.size_upload += data.length;
                }

                onProgress(0, 0, response._info);
            }
        }
    }
}
