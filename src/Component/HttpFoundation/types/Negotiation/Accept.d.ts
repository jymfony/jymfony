declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    /**
     * Accept header
     *
     * @final
     */
    export class Accept extends mix(BaseAccept, AcceptHeader) {
        private _basePart: string;
        private _subPart: string;

        /**
         * Constructor.
         *
         * @param {string} value
         */
        __construct(value: string): void;
        __construct(value: string);

        /**
         * The accept subPart.
         */
        public readonly subPart: string;

        /**
         * The base part.
         */
        public readonly basePart: string;
    }
}
