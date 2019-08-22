/**
 * Represents a password encoder.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 */
class PasswordEncoderInterface {
    /**
     * Encodes the raw password.
     *
     * @param {string} raw  The password to encode
     * @param {string} salt The salt
     *
     * @returns {string} The encoded password
     */
    async encodePassword(raw, salt) { }

    /**
     * Checks a raw password against an encoded password.
     *
     * @param {string} encoded An encoded password
     * @param {string} raw     A raw password
     * @param {string} salt    The salt
     *
     * @returns {boolean} true if the password is valid, false otherwise
     */
    async isPasswordValid(encoded, raw, salt) { }
}

export default getInterface(PasswordEncoderInterface);
