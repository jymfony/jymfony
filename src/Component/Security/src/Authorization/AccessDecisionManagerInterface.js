/**
 * AccessDecisionManagerInterface makes authorization decisions.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AccessDecisionManagerInterface {
    /**
     * Decides whether the access is possible or not.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token A TokenInterface instance
     * @param {Array} attributes An array of attributes associated with the method being invoked
     * @param {Object} [object] The object to secure
     *
     * @returns {boolean} true if the access is granted, false otherwise
     */
    decide(token, attributes, object = undefined) { }
}

export default getInterface(AccessDecisionManagerInterface);
