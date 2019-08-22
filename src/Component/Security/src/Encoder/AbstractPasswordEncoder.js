import { timingSafeEqual } from 'crypto';

const PasswordEncoderInterface = Jymfony.Component.Security.Encoder.PasswordEncoderInterface;

/**
 * Base class for all the password encoders.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 * @abstract
 */
export default class AbstractPasswordEncoder extends implementationOf(PasswordEncoderInterface) {
    /**
     * Merges a password and a salt.
     *
     * @param {string} password
     * @param {string} salt
     *
     * @returns {*}
     *
     * @protected
     */
    _mergePasswordAndSalt(password, salt) {
        if (! salt) {
            return password;
        }

        if (-1 !== salt.indexOf('{')) {
            throw new InvalidArgumentException('Cannot use { in salt.');
        }

        return password + '{' + salt + '}';
    }

    /**
     * Compares two password.
     * This method uses a constant-time comparison algorithm
     * to avoid timing attacks.
     *
     * @param {string} first
     * @param {string} second
     *
     * @returns {boolean}
     *
     * @protected
     */
    _comparePasswords(first, second) {
        try {
            return timingSafeEqual(Buffer.from(first), Buffer.from(second));
        } catch (e) {
            return false;
        }
    }
}

module.exports = AbstractPasswordEncoder;
