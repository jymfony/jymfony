declare namespace Jymfony.Component.HttpFoundation.Exception {
    export class HttpExceptionInterface {
        /**
         * An HTTP response status code
         */
        public readonly statusCode: number;

        /**
         * Response headers.
         */
        public readonly headers: Record<string, string>;
    }
}
