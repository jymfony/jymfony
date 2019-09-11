const AbstractNegotiator = Jymfony.Component.HttpFoundation.Negotiation.AbstractNegotiator;
const AcceptCharset = Jymfony.Component.HttpFoundation.Negotiation.AcceptCharset;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 */
export default class CharsetNegotiator extends AbstractNegotiator {
    /**
     * @inheritdoc
     */
    _acceptFactory(accept) {
        return new AcceptCharset(accept);
    }
}
