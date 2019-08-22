/**
 * AccessMap allows configuration of different access control rules for
 * specific parts of the website.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AccessMapInterface {
    /**
     * Returns security attributes and required channel for the supplied request.
     *
     * @returns {[string[], undefined|string]} A tuple of security attributes and the required channel
     */
    getPatterns(request) { }
}

export default getInterface(AccessMapInterface);
