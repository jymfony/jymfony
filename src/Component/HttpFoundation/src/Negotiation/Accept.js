const AcceptHeader = Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader;
const BaseAccept = Jymfony.Component.HttpFoundation.Negotiation.BaseAccept;
const InvalidMediaTypeException = Jymfony.Component.HttpFoundation.Negotiation.Exception.InvalidMediaTypeException;

/**
 * Accept header
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 * @final
 */
export default class Accept extends mix(BaseAccept, AcceptHeader) {
    /**
     * Constructor.
     *
     * @param {string} value
     */
    __construct(value) {
        super.__construct(value);

        if ('*' === this._type) {
            this._type = '*/*';
        }

        const parts = this._type.split('/');

        if (2 !== parts.length || ! parts[0] || ! parts[1]) {
            throw new InvalidMediaTypeException();
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._basePart = parts[0];

        /**
         * @type {string}
         *
         * @private
         */
        this._subPart = parts[1];
    }

    /**
     * The accept subPart.
     *
     * @returns {string}
     */
    get subPart() {
        return this._subPart;
    }

    /**
     * The base part.
     *
     * @returns {string}
     */
    get basePart() {
        return this._basePart;
    }
}
