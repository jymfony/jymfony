declare namespace Jymfony.Component.HttpFoundation {
    /**
     * Response represents an HTTP response in JSON format.
     *
     * Note that this class does not force the returned JSON content to be an
     * object. It is however recommended that you do return an object as it
     * protects yourself against XSSI and JSON-JavaScript Hijacking.
     *
     * @see https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/AJAX_Security_Cheat_Sheet.md#always-return-json-with-an-object-on-the-outside
     */
    export class JsonResponse extends Response {
        private _callback: string;
        private _data: any;

        /**
         * Constructor.
         *
         * @param data The response data
         * @param status The response status code
         * @param headers An array of response headers
         * @param {boolean} json If the data is already a JSON string
         */
        __construct(data?: any, status?: number, headers?: Record<string, string | string[]>, json?: boolean): void;
        constructor(data?: any, status?: number, headers?: Record<string, string | string[]>, json?: boolean);

        /**
         * Factory method.
         *
         * Example:
         *
         *     return JsonResponse.fromJsonString('{"key": "value"}')
         *         .setSharedMaxAge(300);
         *
         * @param data The JSON response string
         * @param status The response status code
         * @param headers An array of response headers
         */
        static fromJsonString(data?: string | null, status?: number, headers?: Record<string, string | string[]>): JsonResponse

        /**
         * Sets the JSONP callback.
         *
         * @param callback The JSONP callback or null to use none
         *
         * @throws {InvalidArgumentException} When the callback name is not valid
         */
        setCallback(callback?: string | null): this;

        /**
         * Sets a raw string containing a JSON document to be sent.
         *
         * @throws {InvalidArgumentException}
         */
        setJson(json: string): this;

        /**
         * Sets the data to be sent as JSON.
         *
         * @throws {InvalidArgumentException}
         */
        setData(data?: any): this;

        /**
         * Updates the content and headers according to the JSON data and callback.
         */
        protected _update(): this;
    }
}
