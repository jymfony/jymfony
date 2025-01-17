const InvalidArgumentException = Jymfony.Component.HttpFoundation.Negotiation.Exception.InvalidArgumentException;
const InvalidHeaderException = Jymfony.Component.HttpFoundation.Negotiation.Exception.InvalidHeaderException;
const Match = Jymfony.Component.HttpFoundation.Negotiation.Match;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 *
 * @abstract
 */
export default class AbstractNegotiator {
    /**
     * Gets the best match against a list of priority.
     *
     * @param {string} header A string containing an `Accept|Accept-*` header.
     * @param {string[]} priorities A set of server priorities.
     * @param {boolean} [strict = false]
     *
     * @returns {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader|null} best matching type
     */
    getBest(header, priorities, strict = false) {
        if (0 === priorities.length) {
            throw new InvalidArgumentException('A set of server priorities should be given.');
        }

        if (! header) {
            throw new InvalidArgumentException('The header string should not be empty.');
        }

        const acceptedHeaders = [];
        for (const h of this._parseHeader(header)) {
            try {
                acceptedHeaders.push(this._acceptFactory(h));
            } catch (e) {
                if (strict) {
                    throw e;
                }
            }
        }

        const acceptedPriorities = [];
        for (const p of priorities) {
            acceptedPriorities.push(this._acceptFactory(p));
        }

        const matches = this._findMatches(acceptedHeaders, acceptedPriorities);
        const specificMatches = Object.values(matches.reduce(Match.reduce, {})).sort(Match.compare);

        const match = specificMatches.shift();

        return ! match ? null : acceptedPriorities[match.index];
    }

    /**
     * @param {string} header A string containing an `Accept|Accept-*` header.
     *
     * @returns {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader[]} An ordered list of accept header elements
     */
    getOrderedElements(header) {
        if (! header) {
            throw new InvalidArgumentException('The header string should not be empty.');
        }

        const elements = [];
        const orderKeys = [];
        for (const [ key, h ] of __jymfony.getEntries(this._parseHeader(header))) {
            try {
                const element = this._acceptFactory(h);
                elements.push(element);
                orderKeys.push([ element.quality, key, element.value ]);
            } catch {
                // Silently skip in case of invalid headers coming in from a client
            }
        }

        // Sort based on quality and then original order. This is necessary as
        // To ensure that the first in the list for two items with the same
        // Quality stays in that order.
        orderKeys.sort((a, b) => {
            const qA = a[0];
            const qB = b[0];

            if (qA == qB) {
                return a[1] > b[1];
            }

            return (qA > qB) ? -1 : 1;
        });

        const orderedElements = [];
        for (const key of orderKeys) {
            orderedElements.push(elements[key[1]]);
        }

        return orderedElements;
    }

    /**
     * @param {string} header accept header part or server priority
     *
     * @returns {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader} Parsed header object
     *
     * @abstract
     * @protected
     */
    _acceptFactory(header) { // eslint-disable-line no-unused-vars
        throw new Error('Must be implemented');
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader} header
     * @param {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader} priority
     * @param {int} index
     *
     * @returns {Jymfony.Component.HttpFoundation.Negotiation.Match|null} Headers matched
     *
     * @protected
     */
    _match(header, priority, index) {
        const ac = header.type;
        const pc = priority.type;

        const equal = ac.toLowerCase() === pc.toLowerCase() ? 1 : 0;

        if (equal || '*' === ac) {
            return new Match(header.quality * priority.quality, equal, index);
        }

        return null;
    }

    /**
     * @param {string} header A string that contains an `Accept*` header.
     *
     * @returns {string[]}
     *
     * @private
     */
    _parseHeader(header) {
        const matches = header.match(/(?:[^,"]*(?:"[^"]*")?)+[^,"]*/g);
        if (! matches) {
            throw new InvalidHeaderException(__jymfony.sprintf('Failed to parse accept header: "%s"', header));
        }

        return Array.from(matches).map(v => __jymfony.trim(v)).filter(v => !! v);
    }

    /**
     * Finds all the matches against a list of priorities.
     *
     * @param {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader[]} headerParts
     * @param {Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader[]} priorities Configured priorities
     *
     * @returns {Jymfony.Component.HttpFoundation.Negotiation.Match[]} Headers matched
     *
     * @private
     */
    _findMatches(headerParts, priorities) {
        const matches = [];
        for (const [ index, p ] of __jymfony.getEntries(priorities)) {
            for (const h of headerParts) {
                let match;
                if (null !== (match = this._match(h, p, index))) {
                    matches.push(match);
                }
            }
        }

        return matches;
    }
}
