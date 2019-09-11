const AbstractNegotiator = Jymfony.Component.HttpFoundation.Negotiation.AbstractNegotiator;
const AcceptEncoding = Jymfony.Component.HttpFoundation.Negotiation.AcceptEncoding;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 */
export default class EncodingNegotiator extends AbstractNegotiator {
    /**
     * @inheritdoc
     */
    _acceptFactory(accept) {
        return new AcceptEncoding(accept);
    }
}
