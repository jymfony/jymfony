const AuthenticationServiceException = Jymfony.Component.Security.Exception.AuthenticationServiceException;

/**
 * This exception is thrown when an account is reloaded from a provider which
 * doesn't support the passed implementation of UserInterface.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class UnsupportedUserException extends AuthenticationServiceException {
}
