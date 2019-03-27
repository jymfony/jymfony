declare namespace Jymfony.Component.Security.Http {
    import SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;

    /**
     * Trait to get (and set) the URL the user last visited before being forced to authenticate.
     */
    class TargetPathTrait implements MixinInterface {
        public static readonly definition: Newable<TargetPathTrait>;

        /**
         * Sets the target path the user should be redirected to after authentication.
         *
         * Usually, you do not need to set this directly.
         */
        private _saveTargetPath(session: SessionInterface, providerKey: string, uri: string): void;

        /**
         * Returns the URL (if any) the user visited that forced them to login.
         */
        private _getTargetPath(session: SessionInterface, providerKey: string): string;

        /**
         * Removes the target path from the session.
         */
        private _removeTargetPath(session: SessionInterface, providerKey: string): void;
    }
}
