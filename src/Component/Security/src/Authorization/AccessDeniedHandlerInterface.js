/**
 * Handles an access denied exception and return a response.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AccessDeniedHandlerInterface {
    /**
     * Handles an AccessDeniedException, eventually returning a Response
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.Security.Exception.AccessDeniedException} exception
     *
     * @returns {Promise<undefined|null|Jymfony.Component.HttpFoundation.Response>}
     */
    async handle(request, exception) { }
}

export default getInterface(AccessDeniedHandlerInterface);
