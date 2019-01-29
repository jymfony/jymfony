const AbstractNegotiator = Jymfony.Component.HttpFoundation.Negotiation.AbstractNegotiator;
const Accept = Jymfony.Component.HttpFoundation.Negotiation.Accept;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 */
class Negotiator extends AbstractNegotiator {
    /**
     * @inheritdoc
     */
    _acceptFactory(accept) {
        return new Accept(accept);
    }

    /**
     * @inheritdoc
     */
    _match(accept, priority, index) {
        if (! (accept instanceof Accept) || ! (priority instanceof Accept)) {
            return null;
        }

        const acceptBase = accept.basePart;
        const priorityBase = priority.basePart;

        let acceptSub = accept.subPart;
        let prioritySub = priority.subPart;

        const intersection = {};
        for (const [ key, value ] of __jymfony.getEntries(accept.parameters)) {
            if (priority.hasParameter(key) && value === priority.getParameter(key)) {
                intersection[key] = value;
            }
        }

        const baseEqual = acceptBase.toLowerCase() === priorityBase.toLowerCase() ? 1 : 0;
        let subEqual = acceptSub.toLowerCase() === prioritySub.toLowerCase() ? 1 : 0;

        if (('*' === acceptBase || baseEqual)
            && ('*' === acceptSub || subEqual)
            && Object.keys(intersection).length === Object.keys(accept.parameters).length
        ) {
            const score = 100 * baseEqual + 10 * subEqual + Object.keys(intersection).length;

            return new Match(accept.quality * priority.quality, score, index);
        }

        if (-1 === acceptSub.indexOf('+') || -1 === prioritySub.indexOf('+')) {
            return null;
        }

        let acceptPlus, priorityPlus;

        // Handle "+" segment wildcards
        [ acceptSub, acceptPlus ] = this._splitSubPart(acceptSub);
        [ prioritySub, priorityPlus ] = this._splitSubPart(prioritySub);

        // If no wildcards in either the subtype or + segment, do nothing.
        if (!('*' === acceptBase || baseEqual)
            || !('*' === acceptSub || '*' === prioritySub || '*' === acceptPlus || '*' === priorityPlus)
        ) {
            return null;
        }

        subEqual = acceptSub.toLowerCase() === prioritySub.toLowerCase() ? 1 : 0;
        const plusEqual = acceptPlus.toLowerCase() === priorityPlus.toLowerCase() ? 1 : 0;

        if (('*' === acceptSub || '*' === prioritySub || subEqual)
            && ('*' === acceptPlus || '*' === priorityPlus || plusEqual)
            && Object.keys(intersection).length === Object.keys(accept.parameters).length
        ) {
            const score = 100 * baseEqual + 10 * subEqual + plusEqual + Object.keys(intersection).length;

            return new Match(accept.quality * priority.quality, score, index);
        }

        return null;
    }

    /**
     * Split a subpart into the subpart and "plus" part.
     *
     * For media-types of the form "application/vnd.example+json", matching
     * should allow wildcards for either the portion before the "+" or
     * after. This method splits the subpart to allow such matching.
     *
     * @returns {string[]}
     *
     * @protected
     */
    _splitSubPart(subPart) {
        if (-1 === subPart.indexOf('+')) {
            return [ subPart, '' ];
        }

        return subPart.split('+', 2);
    }
}

module.exports = Negotiator;
