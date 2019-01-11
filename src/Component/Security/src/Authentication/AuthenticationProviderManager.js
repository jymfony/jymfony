const AuthenticationManagerInterface = Jymfony.Component.Security.Authentication.AuthenticationManagerInterface;
const AuthenticationEvents = Jymfony.Component.Security.AuthenticationEvents;
const AuthenticationEvent = Jymfony.Component.Security.Event.AuthenticationEvent;
const AuthenticationFailureEvent = Jymfony.Component.Security.Event.AuthenticationFailureEvent;
const AuthenticationProviderInterface = Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;
const ProviderNotFoundException = Jymfony.Component.Security.Exception.ProviderNotFoundException;

/**
 * AuthenticationProviderManager uses a list of AuthenticationProviderInterface
 * instances to authenticate a Token.
 *
 * @memberOf Jymfony.Component.Security.Authentication
 */
class AuthenticationProviderManager extends implementationOf(AuthenticationManagerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface[]} providers An iterable with AuthenticationProviderInterface instances as values
     * @param {boolean} [eraseCredentials = true] Whether to erase credentials after authentication or not
     *
     * @throws InvalidArgumentException
     */
    __construct(providers, eraseCredentials = true) {
        if (! isArray(providers)) {
            providers = Array.from(providers);
        }

        if (0 === providers.length) {
            throw new InvalidArgumentException('You must at least add one authentication provider.');
        }

        /**
         * @type {Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface[]}
         *
         * @private
         */
        this._providers = providers;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._eraseCredentials = eraseCredentials;

        /**
         * @type {Jymfony.Component.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._eventDispatcher = undefined;
    }

    /**
     * Inject an event dispatcher.
     *
     * @param {Jymfony.Component.EventDispatcher.EventDispatcherInterface} dispatcher
     */
    setEventDispatcher(dispatcher) {
        this._eventDispatcher = dispatcher;
    }

    /**
     * @inheritdoc
     */
    async authenticate(token) {
        let lastException = undefined;
        let result = null;

        for (const provider of this._providers) {
            if (! (provider instanceof AuthenticationProviderInterface)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Provider "%s" must implement the AuthenticationProviderInterface.', ReflectionClass.getClassName(provider)));
            }

            if (! provider.supports(token)) {
                continue;
            }

            try {
                result = await provider.authenticate(token);

                if (null !== result) {
                    break;
                }
            } catch (e) {
                if (! (e instanceof AuthenticationException)) {
                    throw e;
                }

                lastException = e;

                if (e instanceof AccountStatusException) {
                    break;
                }
            }
        }

        if (null !== result) {
            if (true === this._eraseCredentials) {
                result.eraseCredentials();
            }

            if (undefined !== this._eventDispatcher) {
                await this._eventDispatcher.dispatch(AuthenticationEvents.AUTHENTICATION_SUCCESS, new AuthenticationEvent(result));
            }

            return result;
        }

        if (undefined === lastException) {
            lastException = new ProviderNotFoundException(__jymfony.sprintf('No Authentication Provider found for token of class "%s".', ReflectionClass.getClassName(token)));
        }

        if (undefined !== this._eventDispatcher) {
            await this._eventDispatcher.dispatch(AuthenticationEvents.AUTHENTICATION_FAILURE, new AuthenticationFailureEvent(token, lastException));
        }

        lastException.token = token;

        throw lastException;
    }
}

module.exports = AuthenticationProviderManager;
