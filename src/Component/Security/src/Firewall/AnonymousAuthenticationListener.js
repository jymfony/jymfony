const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const AnonymousToken = Jymfony.Component.Security.Authentication.Token.AnonymousToken;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;

/**
 * AnonymousAuthenticationListener automatically adds a Token if none is
 * already present.
 *
 * @memberOf Jymfony.Component.Security.Firewall
 */
export default class AnonymousAuthenticationListener extends implementationOf(ListenerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface} tokenStorage
     * @param {string} secret
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger]
     * @param {Jymfony.Component.Security.Authentication.AuthenticationManagerInterface} [authenticationManager]
     */
    __construct(tokenStorage, secret, logger = undefined, authenticationManager = undefined) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;

        /**
         * @type {string}
         *
         * @private
         */
        this._secret = secret;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {undefined|Jymfony.Component.Security.Authentication.AuthenticationManagerInterface}
         *
         * @private
         */
        this._authenticationManager = authenticationManager;
    }

    /**
     * @param {Jymfony.Contracts.HttpServer.Event.RequestEvent} event
     *
     * @returns {Promise<void>}
     */
    async handle(event) {
        let token = this._tokenStorage.getToken(event.request);
        if (!! token) {
            return;
        }

        try {
            token = new AnonymousToken(this._secret, []);
            if (this._authenticationManager) {
                token = await this._authenticationManager.authenticate(token);
            }

            this._tokenStorage.setToken(event.request, token);
            this._logger.info('Populated the TokenStorage with an anonymous Token.');
        } catch (e) {
            if (e instanceof AuthenticationException) {
                this._logger.info('Anonymous authentication failed.', { exception: e });
            } else {
                throw e;
            }
        }
    }
}
