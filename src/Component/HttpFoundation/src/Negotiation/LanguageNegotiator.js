const AbstractNegotiator = Jymfony.Component.HttpFoundation.Negotiation.AbstractNegotiator;
const AcceptLanguage = Jymfony.Component.HttpFoundation.Negotiation.AcceptLanguage;
const Match = Jymfony.Component.HttpFoundation.Negotiation.Match;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 */
export default class LanguageNegotiator extends AbstractNegotiator {
    /**
     * @inheritdoc
     */
    _acceptFactory(accept) {
        return new AcceptLanguage(accept);
    }

    /**
     * @inheritdoc
     */
    _match(acceptLanguage, priority, index) {
        if (! (acceptLanguage instanceof AcceptLanguage) || ! (priority instanceof AcceptLanguage)) {
            return null;
        }

        const acceptBase = acceptLanguage.basePart;
        const priorityBase = priority.basePart;

        const acceptSub = acceptLanguage.subPart;
        const prioritySub = priority.subPart;

        const baseEqual = acceptBase.toLowerCase() === priorityBase.toLowerCase() ? 1 : 0;
        const subEqual = acceptSub.toLowerCase() === prioritySub.toLowerCase() ? 1 : 0;

        if (('*' === acceptBase || baseEqual) && ('' === acceptSub || subEqual)) {
            const score = 10 * baseEqual + subEqual;

            return new Match(acceptLanguage.quality * priority.quality, score, index);
        }

        return null;
    }
}
