const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const Role = Jymfony.Component.Security.Role.Role;
const SwitchUserRole = Jymfony.Component.Security.Role.SwitchUserRole;
const EquatableInterface = Jymfony.Component.Security.User.EquatableInterface;
const UserInterface = Jymfony.Component.Security.User.UserInterface;

/**
 * Base class for Token instances.
 *
 * @memberOf Jymfony.Component.Security.Authentication.Token
 * @abstract
 */
export default class AbstractToken extends implementationOf(TokenInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Role.Role[]|string[]} [roles = []]
     */
    __construct(roles = []) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._authenticated = false;

        /**
         * @type {Set<Jymfony.Component.Security.Role.Role>}
         *
         * @private
         */
        this._roles = new Set();

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._attributes = {};

        /**
         * @type {Jymfony.Component.Security.User.UserInterface}
         *
         * @private
         */
        this._user = undefined;

        /**
         * Used in serialization
         *
         * @type {Jymfony.Component.Security.Role.Role[]}
         *
         * @private
         */
        this._rolesArray = undefined;

        for (const role of roles) {
            if (role instanceof Role) {
                this._roles.add(role);
            } else {
                this._roles.add(new Role(role));
            }
        }
    }

    /**
     * @inheritdoc
     */
    get roles() {
        return [ ...this._roles ];
    }

    /**
     * @inheritdoc
     */
    get user() {
        return this._user;
    }

    /**
     * @inheritdoc
     */
    set user(user) {
        if (null !== user && ! (user instanceof UserInterface)) {
            throw new TypeError(__jymfony.sprintf('User must be a UserInterface or null, %s passed', __jymfony.get_debug_type(user)));
        }

        let changed = this._user !== undefined;
        if (this._user instanceof UserInterface && user instanceof UserInterface) {
            changed = this._hasUserChanged(user);
        }

        /**
         * @type {Jymfony.Component.Security.User.UserInterface}
         *
         * @private
         */
        this._user = user || undefined;

        if (changed) {
            this.authenticated = false;
        }
    }

    /**
     * @inheritdoc
     */
    get username() {
        if (this._user) {
            return this._user.username;
        }

        return null;
    }

    /**
     * @inheritdoc
     */
    get authenticated() {
        return this._authenticated;
    }

    /**
     * @inheritdoc
     */
    set authenticated(isAuthenticated) {
        this._authenticated = !! isAuthenticated;
    }

    /**
     * @inheritdoc
     */
    eraseCredentials() {
        if (this._user instanceof UserInterface) {
            this._user.eraseCredentials();
        }
    }

    /**
     * @inheritdoc
     */
    get attributes() {
        return Object.assign({}, this._attributes);
    }

    /**
     * @inheritdoc
     */
    set attributes(attributes) {
        this._attributes = Object.assign({}, attributes);
    }

    /**
     * @inheritdoc
     */
    hasAttribute(name) {
        return this._attributes.hasOwnProperty(name);
    }

    /**
     * @inheritdoc
     */
    getAttribute(name) {
        if (! this.hasAttribute(name)) {
            throw new InvalidArgumentException(__jymfony.sprintf('This token has no "%s" attribute.', name));
        }

        return this._attributes[name];
    }

    /**
     * @inheritdoc
     */
    setAttribute(name, value) {
        this._attributes[name] = value;
    }

    /**
     * @see __jymfony.serialize
     *
     * @returns {string[]}
     */
    __sleep() {
        this._rolesArray = this.roles;

        return [
            '_rolesArray',
            '_user',
            '_authenticated',
            '_attributes',
        ];
    }

    /**
     * @see __jymfony.unserialize
     */
    __wakeup() {
        this._roles = new Set();

        for (const role of this._rolesArray) {
            if (role instanceof SwitchUserRole) {
                this._roles.add(new SwitchUserRole(role.toString(), role.source));
            } else {
                this._roles.add(new Role(role.toString()));
            }
        }

        this._rolesArray = undefined;
    }

    /**
     * Checks whether the user that is being set is different from
     * the previous one.
     *
     * @param {Jymfony.Component.Security.User.UserInterface} user
     *
     * @returns {boolean}
     *
     * @private
     */
    _hasUserChanged(user) {
        if (this._user instanceof EquatableInterface) {
            return ! this._user.isEqualTo(user);
        }

        if (this._user.password !== user.password) {
            return true;
        }

        if (this._user.salt !== user.salt) {
            return true;
        }

        if (this._user.username !== user.username) {
            return true;
        }

        if (this._user.isAccountNonExpired() !== user.isAccountNonExpired()) {
            return true;
        }

        if (this._user.isAccountNonLocked() !== user.isAccountNonLocked()) {
            return true;
        }

        if (this._user.isCredentialsNonExpired() !== user.isCredentialsNonExpired()) {
            return true;
        }

        return this._user.isEnabled() !== user.isEnabled();
    }

    /**
     * @inheritdoc
     */
    toString() {
        const reflClass = new ReflectionClass(this);
        const $class = reflClass.name.substr(reflClass.namespaceName.length + 1);

        const roles = [];
        for (const role of this._roles) {
            roles.push(role.toString());
        }

        return __jymfony.sprintf('%s(user="%s", authenticated=%s, roles="%s")',
            $class, this.username, JSON.stringify(this.authenticated), roles.join(', '));
    }
}
