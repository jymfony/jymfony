/**
 * EquatableInterface used to test if two objects are equal in security
 * and re-authentication context.
 *
 * @memberOf Jymfony.Component.Security.User
 */
class EquatableInterface {
    /**
     * The equality comparison should neither be done by referential equality
     * nor by comparing identities (i.e. getId() === getId()).
     *
     * However, you do not need to compare every attribute, but only those that
     * are relevant for assessing whether re-authentication is required.
     *
     * @returns {boolean}
     */
    isEqualTo(user) { }
}

module.exports = getInterface(EquatableInterface);
