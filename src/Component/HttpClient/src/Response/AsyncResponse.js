const CommonResponseTrait = Jymfony.Component.HttpClient.Response.CommonResponseTrait;
const ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;
const TransportException = Jymfony.Contracts.HttpClient.Exception.TransportException;

/**
 * Provides a single extension point to process a response's content stream.
 *
 * @memberOf Jymfony.Component.HttpClient.Response
 * @final
 */
export default class AsyncResponse extends implementationOf(ResponseInterface, CommonResponseTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpClient.HttpClientInterface} client
     * @param {string} method
     * @param {string} url
     * @param {Object.<string, *>} options
     * @param {function(response: Jymfony.Component.HttpClient.Response.AsyncResponse, function(): NodeJS.ReadableStream): Promise<void>} passthru
     */
    __construct(client, method, url, options, passthru) {
        /**
         * @type {Jymfony.Contracts.HttpClient.HttpClientInterface}
         *
         * @private
         */
        this._client = client;

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._info = { canceled: false, previous_info: [] };

        /**
         * @type {boolean|WritableStream|(function(Object.<string, string[]>):boolean|WritableStream)}
         *
         * @private
         */
        this._shouldBuffer = undefined === options.buffer ? true : options.buffer;

        /**
         * @type {*}
         *
         * @private
         */
        this._buffer = undefined;

        const onProgress = options.on_progress || (() => {});
        options.on_progress = (dlNow, dlSize, info) => {
            onProgress(dlNow, dlSize, Object.assign({}, info, this._info));
        };

        /**
         * @type {Jymfony.Contracts.HttpClient.ResponseInterface}
         *
         * @private
         */
        this._response = this._client.request(method, url, Object.assign({}, options, { buffer: false }));

        /**
         * @type {function(response: Jymfony.Component.HttpClient.Response.AsyncResponse, function(): NodeJS.ReadableStream): Promise<void>}
         *
         * @private
         */
        this._passthru = passthru;

        /**
         * @type {function():boolean}
         *
         * @private
         */
        this._initializer = () => {
            return null !== this._shouldBuffer;
        };

        this._info.user_data = options.user_data;
    }

    /**
     * @inheritdoc
     */
    async getStatusCode() {
        if (this._initializer) {
            await this._initialize();
        }

        return this._response.getStatusCode();
    }

    /**
     * @inheritdoc
     */
    async getHeaders(Throw = false) {
        if (this._initializer) {
            await this._initialize();
        }

        const headers = await this._response.getHeaders(Throw);

        if (Throw) {
            this._checkStatusCode();
        }

        return headers;
    }

    /**
     * @inheritdoc
     */
    getInfo(type = null) {
        if (null !== type) {
            const info = this._info[type];
            if (undefined === info || null === info) {
                return this._response.getInfo(type);
            }

            return info;
        }

        return Object.assign({}, this._info, this._response.getInfo());
    }

    /**
     * Sets an info into this response object.
     *
     * @param {string} type
     * @param {*} value
     */
    setInfo(type, value) {
        this._info[type] = value;
    }

    /**
     * @inheritdoc
     */
    close() {
        this._response.cancel();
    }

    /**
     * @inheritdoc
     */
    _perform() {
        const passthru = async () => {
            this._buffer = await this._passthru({
                response: this,
                headers: () => this._response.getHeaders(false),
                streamer: (Throw = true) => __self._passthru(this, Throw),
                passthru,
            });
        };

        return passthru();
    }

    /**
     * Replaces the currently processed response by doing a new request.
     */
    replaceRequest(method, url, options = {}) {
        this._info.canceled = false;
        this._info.previous_info.push(this._response.getInfo());

        const onProgress = options.on_progress || (() => {});
        options.on_progress = (dlNow, dlSize, info) => {
            onProgress(dlNow, dlSize, Object.assign({}, info, this._info));
        };

        this._response = this._client.request(method, url, Object.assign({}, options, { buffer: false }));
    }

    /**
     * @inheritdoc
     */
    cancel() {
        if (this._info.canceled) {
            return;
        }

        this._info.canceled = true;
        this._info.error = 'Response has been canceled.';
        this.close();

        this._client = null;
    }

    /**
     * @inheritdoc
     */
    async getContent(Throw = true) {
        if (this._initializer) {
            await this._initialize();
        }

        if (Throw) {
            this._checkStatusCode();
        }

        const error = this.getInfo('error');
        if (null !== error) {
            throw new TransportException(error);
        }

        if (null === this._info.canceled) {
            throw new TransportException('Request has been canceled');
        }

        return this._buffer;
    }

    /**
     * Create a readable stream to pass data through.
     * Could be intercepted by passthru closure passed as last argument in constructor.
     *
     * @param response
     *
     * @returns {Promise<NodeJS.ReadableStream|Buffer>}
     *
     * @private
     */
    static async _passthru(response, Throw) {
        if (null === response._info.canceled) {
            throw new TransportException('Request has been canceled');
        }

        const readable = await response._response.getContent(Throw);
        if (true === response._shouldBuffer) {
            if (response._buffer) {
                return response._buffer;
            }

            const stream = new __jymfony.StreamBuffer();
            try {
                await response._pipeline(readable, stream);
            } catch (e) {
                response._info.error = e.message;
                throw new TransportException(e.message, 0, e);
            }

            return response._buffer = stream.buffer;
        }

        if (false === response._shouldBuffer) {
            return readable;
        }

        if (null === readable) {
            throw new TransportException('Cannot get the content of the response twice: buffering is disabled.');
        }

        return response._pipeline(readable, response._shouldBuffer);
    }
}
