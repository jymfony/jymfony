declare namespace Jymfony.Component.Security.Exception {
    /**
     * This exception is thrown when an account is reloaded from a provider which
     * doesn't support the passed implementation of UserInterface.
     */
    export class UnsupportedUserException extends AuthenticationServiceException {
    }
}
