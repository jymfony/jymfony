const ExceptionInterface = Jymfony.Contracts.HttpClient.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.HttpClient.Exception
 */
export default class RuntimeException extends mix(global.RuntimeException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.HttpClient.ResponseInterface} response
     */
    __construct(response) {
        this._response = response;
        const code = response.getInfo('http_code');
        const url = response.getInfo('url');
        let message = __jymfony.sprintf('HTTP %d returned for "%s".', code, url);

        let httpCodeFound = false;
        let isJson = false;
        for (const h of Object.keys(response.getInfo('response_headers'))) {
            if (h.startsWith('HTTP/')) {
                if (httpCodeFound) {
                    break;
                }

                message = __jymfony.sprintf('%s returned for "%s".', h, url);
                httpCodeFound = true;
            }

            if (h.match(/^content-type:/i)) {
                if (h.match(/\bjson\b/i)) {
                    isJson = true;
                }

                if (httpCodeFound) {
                    break;
                }
            }
        }

        // Try to guess a better error message using common API error formats
        // The MIME type isn't explicitly checked because some formats inherit from others
        // Ex: JSON:API follows RFC 7807 semantics, Hydra can be used in any JSON-LD-compatible format
        let body, separator;
        if (isJson && (body = JSON.parse(response.getContent(false)))) {
            if (body['hydra:title'] || body['hydra:description']) {
                // See http://www.hydra-cg.com/spec/latest/core/#description-of-http-status-codes-and-errors
                separator = body['hydra:title'] && body['hydra:description'] ? '\n\n' : '';
                message = (body['hydra:title'] || '') + separator + (body['hydra:description'] || '');
            } else if ((body.title || body.detail) && (isScalar(body['title'] || '') && isScalar(body['detail'] || ''))) {
                // See RFC 7807 and https://jsonapi.org/format/#error-objects
                separator = body.title && body.detail ? '\n\n' : '';
                message = (body.title || '') + separator + (body.detail || '');
            }
        }

        super.__construct(message, code);
    }

    /**
     * @returns {Jymfony.Contracts.HttpClient.ResponseInterface}
     */
    get response() {
        return this._response;
    }
}
