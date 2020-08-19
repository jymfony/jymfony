declare namespace Jymfony.Contracts.HttpFoundation {
    export class ResponseInterface {
        public static readonly definition: Newable<ResponseInterface>;
        public headers: HeaderBagInterface;

        /**
         * Is response invalid?
         *
         * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
         *
         * @final
         */
        public readonly invalid: boolean;

        /**
         * Is response informative?
         *
         * @final
         */
        public readonly isInformational: boolean;

        /**
         * Is response successful?
         *
         * @final
         */
        public readonly isSuccessful: boolean;

        /**
         * Is the response a redirect?
         *
         * @final
         */
        public readonly isRedirection: boolean;

        /**
         * Is there a client error?
         *
         * @final
         */
        public readonly isClientError: boolean;

        /**
         * Was there a server side error?
         *
         * @final
         */
        public readonly isServerError: boolean;

        /**
         * Is the response OK?
         *
         * @final
         */
        public readonly isOk: boolean;

        /**
         * Is the response forbidden?
         *
         * @final
         */
        public readonly isForbidden: boolean;

        /**
         * Is the response a not found error?
         *
         * @final
         */
        public readonly isNotFound: boolean;

        /**
         * Is the response a redirect of some form?
         *
         * @final
         */
        isRedirect(location?: string | undefined): boolean;

        /**
         * Is the response empty?
         *
         * @final
         */
        public readonly isEmpty: boolean;

        /**
         * Sets the response content.
         */
        public readonly content: Invokable<string> | string;

        /**
         * Gets the response status code.
         */
        public readonly statusCode: number;

        /**
         * Gets the response status text.
         *
         * @returns {string}
         */
        public readonly statusText: string;

        /**
         * The response charset.
         */
        public readonly charset: string | undefined;

        /**
         * The HTTP protocol version (1.0 or 1.1).
         *
         * @final
         */
        public readonly protocolVersion: string;
    }
}
