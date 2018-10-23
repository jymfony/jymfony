/**
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AuthorizationCheckerInterface {
    /**
     * Checks if the attributes are granted against the given authentication token and optionally supplied subject.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     * @param {*} attributes
     * @param {*} [subject]
     *
     * @returns {boolean}
     */
    isGranted(token, attributes, subject = undefined) { }
}

module.exports = getInterface(AuthorizationCheckerInterface);
