declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    class Negotiator extends AbstractNegotiator {
        /**
         * @inheritdoc
         */
        protected _acceptFactory(header: string): AcceptHeader;

        protected _match(header: AcceptHeader, priority: AcceptHeader, index: number): Match | null;

        /**
         * Split a subpart into the subpart and "plus" part.
         *
         * For media-types of the form "application/vnd.example+json", matching
         * should allow wildcards for either the portion before the "+" or
         * after. This method splits the subpart to allow such matching.
         */
        protected _splitSubPart(subPart: string): string[];
    }
}
