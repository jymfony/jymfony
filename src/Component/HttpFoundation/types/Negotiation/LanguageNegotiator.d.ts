declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    export class LanguageNegotiator extends AbstractNegotiator {
        /**
         * @inheritdoc
         */
        protected _acceptFactory(header: string): AcceptHeader;

        /**
         * @inheritdoc
         */
        _match(acceptLanguage: AcceptLanguage, priority: AcceptLanguage, index: number): Match | null;
    }
}
