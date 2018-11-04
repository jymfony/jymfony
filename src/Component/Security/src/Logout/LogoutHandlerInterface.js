/**
 * @memberOf Jymfony.Component.Security.Logout
 */
class LogoutHandlerInterface {
    /**
     * Performs a logout.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.HttpFoundation.Response} response
     *
     * @returns {Promise<void>}
     */
    async logout(request, response) { }
}

module.exports = getInterface(LogoutHandlerInterface);
