declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    /**
     * AcceptCharset header
     *
     * @final
     */
    class AcceptLanguage extends mix(BaseAccept, AcceptHeader) {
        private _language: string;
        private _script: string;
        private _region: string;

        /**
         * @inheritdoc
         */
        __construct(value: string): void;
        constructor(value: string);

        public readonly subPart: string;

        public readonly basePart: string;
    }
}
