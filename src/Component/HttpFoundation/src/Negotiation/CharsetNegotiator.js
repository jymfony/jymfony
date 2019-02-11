const AbstractNegotiator = Jymfony.Component.HttpFoundation.Negotiation.AbstractNegotiator;
const AcceptCharset = Jymfony.Component.HttpFoundation.Negotiation.AcceptCharset;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 */
class CharsetNegotiator extends AbstractNegotiator {
    /**
     * @inheritdoc
     */
    _acceptFactory(accept) {
        return new AcceptCharset(accept);
    }
}

module.exports = CharsetNegotiator;
