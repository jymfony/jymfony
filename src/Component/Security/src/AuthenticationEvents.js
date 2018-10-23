/**
 * Enumeration of the authentication events.
 *
 * @memberOf Jymfony.Component.Security
 * @final
 */
class AuthenticationEvents {
}

/**
 * The AUTHENTICATION_SUCCESS event occurs after a user is authenticated
 * by one provider.
 */
AuthenticationEvents.AUTHENTICATION_SUCCESS = 'security.authentication.success';

/**
 * The AUTHENTICATION_FAILURE event occurs after a user cannot be
 * authenticated by any of the providers.
 */
AuthenticationEvents.AUTHENTICATION_FAILURE = 'security.authentication.failure';

module.exports = AuthenticationEvents;
