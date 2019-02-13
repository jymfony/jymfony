declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    export class EncodingNegotiator extends AbstractNegotiator {
        /**
         * @inheritdoc
         */
        protected _acceptFactory(header: string): AcceptHeader;
    }
}
