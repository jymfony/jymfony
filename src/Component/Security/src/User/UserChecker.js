const AccountExpiredException = Jymfony.Component.Security.Exception.AccountExpiredException;
const CredentialsExpiredException = Jymfony.Component.Security.Exception.CredentialsExpiredException;
const DisabledException = Jymfony.Component.Security.Exception.DisabledException;
const LockedException = Jymfony.Component.Security.Exception.LockedException;
const UserCheckerInterface = Jymfony.Component.Security.User.UserCheckerInterface;

/**
 * Checks the user account flags.
 *
 * @memberOf Jymfony.Component.Security.User
 */
class UserChecker extends implementationOf(UserCheckerInterface) {
    /**
     * @inheritdoc
     */
    checkPreAuth(user) {
        if (! user.isAccountNonLocked()) {
            throw new LockedException('User account is locked.', user);
        }

        if (! user.isEnabled()) {
            throw new DisabledException('User account is disabled.', user);
        }

        if (! user.isAccountNonExpired()) {
            throw new AccountExpiredException('User account has expired.', user);
        }
    }

    /**
     * @inheritdoc
     */
    checkPostAuth(user) {
        if (! user.isCredentialsNonExpired()) {
            throw new CredentialsExpiredException('User credentials have expired.', user);
        }
    }
}

module.exports = UserChecker;
