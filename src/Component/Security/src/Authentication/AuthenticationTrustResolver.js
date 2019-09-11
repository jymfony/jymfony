const AuthenticationTrustResolverInterface = Jymfony.Component.Security.Authentication.AuthenticationTrustResolverInterface;

/**
 * Default implementation of authentication trust resolver.
 *
 * @memberOf Jymfony.Component.Security.Authentication
 */
export default class AuthenticationTrustResolver extends implementationOf(AuthenticationTrustResolverInterface) {
    /**
     * Constructor.
     *
     * @param {string} anonymousClass
     * @param {string} rememberMeClass
     */
    __construct(anonymousClass, rememberMeClass) {
        /**
         * Anonymous token class.
         *
         * @type {string}
         *
         * @private
         */
        this._anonymousClass = anonymousClass;

        /**
         * Remember me token class.
         *
         * @type {string}
         *
         * @private
         */
        this._rememberMeClass = rememberMeClass;
    }

    /**
     * @inheritdoc
     */
    isAnonymous(token = null) {
        if (null === token || undefined === token) {
            return false;
        }

        return new ReflectionClass(token).isInstanceOf(this._anonymousClass);
    }

    /**
     * @inheritdoc
     */
    isRememberMe(token = null) {
        if (null === token || undefined === token) {
            return false;
        }

        return new ReflectionClass(token).isInstanceOf(this._rememberMeClass);
    }

    /**
     * @inheritdoc
     */
    isFullFledged(token = null) {
        if (null === token || undefined === token) {
            return false;
        }

        return ! this.isAnonymous(token) && ! this.isRememberMe(token);
    }
}
