const UserInterface = Jymfony.Component.Security.User.UserInterface;

class TestUser extends implementationOf(UserInterface) {
    __construct(name) {
        this._name = name;
    }

    toString() {
        return this._name;
    }

    get roles() {
        return [];
    }

    get password() {
        return null;
    }

    get salt() {
        return null;
    }

    get username() {
        return this._name;
    }

    eraseCredentials() {
        // Empty
    }

    isAccountNonExpired() {
        return true;
    }

    isAccountNonLocked() {
        return true;
    }

    isCredentialsNonExpired() {
        return true;
    }

    isEnabled() {
        return true;
    }
}

module.exports = TestUser;
