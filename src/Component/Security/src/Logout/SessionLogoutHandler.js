const LogoutHandlerInterface = Jymfony.Component.Security.Logout.LogoutHandlerInterface;

/**
 * Handler for clearing invalidating the current session.
 *
 * @memberOf Jymfony.Component.Security.Logout
 */
export default class SessionLogoutHandler extends implementationOf(LogoutHandlerInterface) {
    /**
     * @inheritdoc
     */
    async logout(request) {
        await request.session.invalidate();
    }
}
