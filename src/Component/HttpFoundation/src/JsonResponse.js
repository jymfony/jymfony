import { isValidIdentifier } from '@jymfony/compiler';
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Response represents an HTTP response in JSON format.
 *
 * Note that this class does not force the returned JSON content to be an
 * object. It is however recommended that you do return an object as it
 * protects yourself against XSSI and JSON-JavaScript Hijacking.
 *
 * @see https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/AJAX_Security_Cheat_Sheet.md#always-return-json-with-an-object-on-the-outside
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class JsonResponse extends Response {
    /**
     * @type {string}
     *
     * @private
     */
    _callback;

    /**
     * @type {*}
     *
     * @private
     */
    _data = null;

    /**
     * Constructor.
     *
     * @param {*} data The response data
     * @param {int} status The response status code
     * @param {*} headers An array of response headers
     * @param {boolean} json If the data is already a JSON string
     */
    __construct(data = {}, status = Response.HTTP_OK, headers = {}, json = false) {
        super.__construct('', status, headers);
        if (null === data) {
            data = {};
        }

        if (json) {
            this.setJson(data);
        } else {
            this.setData(data);
        }
    }

    /**
     * Factory method.
     *
     * Example:
     *
     *     return JsonResponse.fromJsonString('{"key": "value"}')
     *         .setSharedMaxAge(300);
     *
     * @param {string|null} data The JSON response string
     * @param {int} status The response status code
     * @param {*} headers An array of response headers
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     */
    static fromJsonString(data = null, status = 200, headers = []) {
        return new __self(data, status, headers, true);
    }

    /**
     * Sets the JSONP callback.
     *
     * @param {string|null} callback The JSONP callback or null to use none
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     *
     * @throws {InvalidArgumentException} When the callback name is not valid
     */
    setCallback(callback = null) {
        if (null !== callback && !isValidIdentifier(callback)) {
            throw new RuntimeException(__jymfony.sprintf('Invalid callback identifier %s passed to JsonResponse', JSON.stringify(callback)));
        }

        this._callback = callback;

        return this._update();
    }

    /**
     * Sets a raw string containing a JSON document to be sent.
     *
     * @param {string} json
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     *
     * @throws {InvalidArgumentException}
     */
    setJson(json) {
        this._data = json;

        return this._update();
    }

    /**
     * Sets the data to be sent as JSON.
     *
     * @param {*} data
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     *
     * @throws {InvalidArgumentException}
     */
    setData(data = {}) {
        return this.setJson(JSON.stringify(data));
    }

    /**
     * Updates the content and headers according to the JSON data and callback.
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     */
    _update() {
        let data = this._data;
        if (null !== this._callback && undefined !== this._callback) {
            // Not using application/javascript for compatibility reasons with older browsers.
            this.headers.set('Content-Type', 'text/javascript');
            data = __jymfony.sprintf('/**/%s(%s);', this._callback, this._data);
        } else {
            /*
             * Only set the header when there is none or when it equals 'text/javascript' (from a previous
             * update with callback) in order to not overwrite a custom definition.
             */
            if (!this.headers.has('Content-Type') || 'text/javascript' === this.headers.get('Content-Type')) {
                this.headers.set('Content-Type', 'application/json');
            }
        }

        this.content = data;

        return this;
    }
}
