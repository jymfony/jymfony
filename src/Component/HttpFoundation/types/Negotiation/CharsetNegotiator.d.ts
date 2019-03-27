declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    export class CharsetNegotiator extends AbstractNegotiator {
        /**
         * @inheritdoc
         */
        protected _acceptFactory(header: string): AcceptHeader;
    }
}
