const AbstractPasswordEncoder = Jymfony.Component.Security.Encoder.AbstractPasswordEncoder;

/**
 * PlaintextPasswordEncoder does not do any encoding.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 */
class PlaintextPasswordEncoder extends AbstractPasswordEncoder {
    /**
     * Constructor.
     *
     * @param {boolean} [ignorePasswordCase = false] Whether to ignore password case
     */
    __construct(ignorePasswordCase = false) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._ignoreCase = ignorePasswordCase;
    }

    /**
     * @inheritdoc
     */
    async encodePassword(raw, salt) {
        return this._mergePasswordAndSalt(raw, salt);
    }

    /**
     * @inheritdoc
     */
    async isPasswordValid(encoded, raw, salt) {
        const second = this._mergePasswordAndSalt(raw, salt);

        if (! this._ignoreCase) {
            return this._comparePasswords(encoded, second);
        }

        return this._comparePasswords(encoded.toLowerCase(), second.toLowerCase());
    }
}

module.exports = PlaintextPasswordEncoder;
