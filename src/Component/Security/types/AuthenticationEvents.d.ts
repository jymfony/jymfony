declare namespace Jymfony.Component.Security {
    /**
     * Enumeration of the authentication events.
     *
     * @final
     */
    export class AuthenticationEvents {
        /**
         * The AUTHENTICATION_SUCCESS event occurs after a user is authenticated
         * by one provider.
         */
        public static readonly AUTHENTICATION_SUCCESS = 'security.authentication.success';

        /**
         * The AUTHENTICATION_FAILURE event occurs after a user cannot be
         * authenticated by any of the providers.
         */
        public static readonly AUTHENTICATION_FAILURE = 'security.authentication.failure';
    }
}
