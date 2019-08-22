/**
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 * @final
 */
export default class Match {
    /**
     * Constructor.
     *
     * @param {number} quality
     * @param {int} score
     * @param {int} index
     */
    __construct(quality, score, index) {
        /**
         * @type {number}
         */
        this.quality = quality;

        /**
         * @type {int}
         */
        this.score = score;

        /**
         * @type {int}
         */
        this.index = index;
    }

    /**
     * Compares two matches instances.
     *
     * @param {Jymfony.Component.HttpFoundation.Negotiation.Match} a
     * @param {Jymfony.Component.HttpFoundation.Negotiation.Match} b
     *
     * @returns {int}
     */
    static compare(a, b) {
        if (a.quality !== b.quality) {
            return a.quality > b.quality ? -1 : 1;
        }

        if (a.index !== b.index) {
            return a.index > b.index ? 1 : -1;
        }

        return 0;
    }

    /**
     * @param {Object.<int, Jymfony.Component.HttpFoundation.Negotiation.Match>} carry reduced array
     * @param {Jymfony.Component.HttpFoundation.Negotiation.Match} match match to be reduced
     *
     * @returns {Object.<int, Jymfony.Component.HttpFoundation.Negotiation.Match>}
     */
    static reduce(carry, match) {
        if (undefined === carry[match.index] || carry[match.index].score < match.score) {
            carry[match.index] = match;
        }

        return carry;
    }
}
