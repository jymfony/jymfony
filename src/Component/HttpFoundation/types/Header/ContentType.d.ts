declare namespace Jymfony.Component.HttpFoundation.Header {
    export class ContentType {
        private _type: string;
        private _subtype: string;
        private _parameters: Record<string, string>;

        /**
         * Constructor.
         */
        __construct(contentType: string): void;
        constructor(contentType: string);

        /**
         * Gets the content type (ex: text, application, multipart, ...)
         */
        public readonly type: string;

        /**
         * Gets the content subtype (ex: html, plain, json, ...)
         */
        public readonly subtype: string;

        /**
         * The MIME content type (text/html, application/json, ...)
         */
        public readonly essence: string;

        /**
         * Gets a content type parameter (ex: charset).
         */
        get(parameter: string, defaultValue?: string | undefined): string | undefined;

        /**
         * Parses and validates the the content-type header.
         */
        protected _parse(contentType: string): void;
    }
}
