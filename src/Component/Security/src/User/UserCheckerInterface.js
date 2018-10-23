/**
 * Implement to throw AccountStatusException during the authentication process.
 *
 * Can be used when you want to check the account status, e.g when the account is
 * disabled or blocked. This should not be used to make authentication decisions.
 *
 * @memberOf Jymfony.Component.Security.User
 */
class UserCheckerInterface {
    /**
     * Checks the user account before authentication.
     *
     * @param {Jymfony.Component.Security.User.UserInterface} user
     *
     * @throws {Jymfony.Component.Security.Exception.AccountStatusException}
     */
    checkPreAuth(user) { }

    /**
     * Checks the user account after authentication.
     *
     * @param {Jymfony.Component.Security.User.UserInterface} user
     *
     * @throws {Jymfony.Component.Security.Exception.AccountStatusException}
     */
    checkPostAuth(user) { }
}

module.exports = getInterface(UserCheckerInterface);
