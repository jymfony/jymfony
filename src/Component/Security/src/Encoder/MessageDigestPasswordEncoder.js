const AbstractPasswordEncoder = Jymfony.Component.Security.Encoder.AbstractPasswordEncoder;
const crypto = require('crypto');

/**
 * PlaintextPasswordEncoder does not do any encoding.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 */
class MessageDigestPasswordEncoder extends AbstractPasswordEncoder {
    /**
     * Constructor.
     *
     * @param {string} [algorithm = 'sha512'] The digest algorithm to use
     * @param {boolean} [encodeHashAsBase64 = true] Whether to base64 encode the password hash
     * @param {int} [iterations = 5000] The number of iterations to use to stretch the password hash
     */
    __construct(algorithm = 'sha512', encodeHashAsBase64 = true, iterations = 5000) {
        /**
         * @type {string}
         *
         * @private
         */
        this._algorithm = algorithm;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._encodeAsBase64 = encodeHashAsBase64;

        /**
         * @type {int}
         *
         * @private
         */
        this._iterations = iterations;
    }

    /**
     * @inheritdoc
     */
    async encodePassword(raw, salt) {
        const salted = this._mergePasswordAndSalt(raw, salt);
        const hash = crypto.createHash(this._algorithm);
        hash.update(salted);

        let digest = hash.digest();

        // "stretch" hash
        for (let i = 1; i < this._iterations; ++i) {
            const hash = crypto.createHash(this._algorithm);
            hash.update(digest.toString('binary') + salted);

            digest = hash.digest();
        }

        return this._encodeAsBase64 ? digest.toString('base64') : digest.toString('binary');
    }

    /**
     * @inheritdoc
     */
    async isPasswordValid(encoded, raw, salt) {
        return this._comparePasswords(encoded, await this.encodePassword(raw, salt));
    }
}

module.exports = MessageDigestPasswordEncoder;
