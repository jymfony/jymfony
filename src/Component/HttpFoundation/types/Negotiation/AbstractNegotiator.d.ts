declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    export abstract class AbstractNegotiator {
        /**
         * Gets the best match against a list of priority.
         *
         * @param header A string containing an `Accept|Accept-*` header.
         * @param priorities A set of server priorities.
         * @param [strict = false]
         *
         * @returns {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader|null} best matching type
         */
        getBest(header: string, priorities: string[], strict?: boolean): AcceptHeader | null;

        /**
         * @param header A string containing an `Accept|Accept-*` header.
         *
         * @returns An ordered list of accept header elements
         */
        getOrderedElements(header: string): AcceptHeader[];

        /**
         * @param header accept header part or server priority
         *
         * @returns Parsed header object
         */
        protected abstract _acceptFactory(header: string): AcceptHeader;

        protected _match(header: AcceptHeader, priority: AcceptHeader, index: number): Match | null;

        private _parseHeader(header: string): string[];

        /**
         * Finds all the matches against a list of priorities.
         */
        private _findMatches(headerParts: AcceptHeader[], priorities: AcceptHeader[]): Match[];
    }
}
