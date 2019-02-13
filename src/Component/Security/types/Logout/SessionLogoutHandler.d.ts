declare namespace Jymfony.Component.Security.Logout {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * Handler for clearing invalidating the current session.
     */
    export class SessionLogoutHandler extends implementationOf(LogoutHandlerInterface) {
        /**
         * @inheritdoc
         */
        logout(request: Request): Promise<void>;
    }
}
