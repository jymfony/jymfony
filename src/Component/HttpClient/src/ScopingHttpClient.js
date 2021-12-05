const HttpClientInterface = Jymfony.Contracts.HttpClient.HttpClientInterface;
const HttpClientTrait = Jymfony.Component.HttpClient.HttpClientTrait;
const LoggerAwareInterface = Jymfony.Contracts.Logger.LoggerAwareInterface;

/**
 * Auto-configure the default options based on the requested URL.
 *
 * @memberOf Jymfony.Component.HttpClient
 */
export default class ScopingHttpClient extends implementationOf(HttpClientInterface, LoggerAwareInterface, HttpClientTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpClient.HttpClientInterface} client
     * @param {Object.<string, *>} defaultOptionsByRegexp
     * @param {RegExp} defaultRegexp
     */
    __construct(client, defaultOptionsByRegexp, defaultRegexp = null) {
        /**
         * @type {Jymfony.Contracts.HttpClient.HttpClientInterface}
         *
         * @private
         */
        this._client = client;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._defaultOptionsByRegexp = defaultOptionsByRegexp;

        /**
         * @type {string}
         *
         * @private
         */
        this._defaultRegexp = defaultRegexp ? defaultRegexp.source : null;

        if (this._defaultRegexp && undefined === defaultOptionsByRegexp[this._defaultRegexp]) {
            throw new InvalidArgumentException(__jymfony.sprintf('No options are mapped to the provided "%s" default regexp.', defaultRegexp.source));
        }
    }

    /**
     *
     * @param {Jymfony.Contracts.HttpClient.HttpClientInterface} client
     * @param {string} baseUri
     * @param {Object.<string, *>} defaultOptions
     * @param {RegExp} regexp
     * @returns {*}
     */
    static forBaseUri(client, baseUri, defaultOptions = {}, regexp = null) {
        if (null === regexp) {
            regexp = __jymfony.regex_quote(HttpClientTrait.definition._resolveUrl(HttpClientTrait.definition._parseUrl('.', undefined, undefined, baseUri), baseUri).href);
        }

        defaultOptions.base_uri = baseUri;

        return new __self(client, { [regexp.source]: defaultOptions }, regexp);
    }

    /**
     * @inheritdoc
     */
    request(method, url, options = {}) {
        try {
            url = this._parseUrl(url, options.query || {}, undefined, options.base_uri);
            url = this._resolveUrl(url, undefined).href;
        } catch (e) {
            if (null === this._defaultRegexp) {
                throw e;
            }

            [ url, options ] = this._prepareRequest(method, url, options, this._defaultOptionsByRegexp[this._defaultRegexp], true);
        }

        for (const [ regexp, defaultOptions ] of __jymfony.getEntries(this._defaultOptionsByRegexp)) {
            if (String(url).match(new RegExp(regexp))) {
                options = this._mergeDefaultOptions(options, defaultOptions, true);
                break;
            }
        }

        return this._client.request(method, url, options);
    }

    /**
     * @inheritdoc
     */
    setLogger(logger) {
        if (this._client instanceof LoggerAwareInterface) {
            this._client.setLogger(logger);
        }
    }
}
