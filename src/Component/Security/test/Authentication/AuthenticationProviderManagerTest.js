const AuthenticationProviderManager = Jymfony.Component.Security.Authentication.AuthenticationProviderManager;
const AuthenticationEvents = Jymfony.Component.Security.AuthenticationEvents;
const AuthenticationProviderInterface = Jymfony.Component.Security.Authentication.Provider.AuthenticationProviderInterface;
const TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;
const UsernamePasswordToken = Jymfony.Component.Security.Authentication.Token.UsernamePasswordToken;
const AuthenticationEvent = Jymfony.Component.Security.Event.AuthenticationEvent;
const AuthenticationFailureEvent = Jymfony.Component.Security.Event.AuthenticationFailureEvent;
const AccountStatusException = Jymfony.Component.Security.Exception.AccountStatusException;
const AuthenticationException = Jymfony.Component.Security.Exception.AuthenticationException;
const ProviderNotFoundException = Jymfony.Component.Security.Exception.ProviderNotFoundException;
const UserInterface = Jymfony.Component.Security.User.UserInterface;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Security] AbstractToken', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('should throw if constructed with no providers', () => {
        expect(() => {
            new AuthenticationProviderManager([]);
        }).to.throw(InvalidArgumentException);
    });

    it('should throw if incorrect provider interface passed', async () => {
        const manager = new AuthenticationProviderManager([ {} ]);
        try {
            await manager.authenticate(this._prophet.prophesize(TokenInterface).reveal());
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
        }
    });

    const getAuthenticationProvider = (supports, tokenOrException = null) => {
        const provider = this._prophet.prophesize(AuthenticationProviderInterface);
        provider.supports(Argument.cetera()).willReturn(supports);

        if (null !== tokenOrException) {
            const refl = new ReflectionClass(tokenOrException);
            if (refl.isSubclassOf(Error)) {
                provider.authenticate(Argument.cetera()).willThrow(tokenOrException);
            } else {
                provider.authenticate(Argument.cetera()).willReturn(tokenOrException);
            }
        }

        return provider.reveal();
    };

    it('authenticate where no provider supports token', async () => {
        const manager = new AuthenticationProviderManager([
            getAuthenticationProvider(false),
        ]);

        const token = this._prophet.prophesize(TokenInterface).reveal();
        try {
            await manager.authenticate(token);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(ProviderNotFoundException);
            expect(e.token).to.be.equal(token);
        }
    });

    it('authenticate should re-throw AccountStatusException', async () => {
        const manager = new AuthenticationProviderManager([
            getAuthenticationProvider(true, AccountStatusException),
        ]);

        const token = this._prophet.prophesize(TokenInterface).reveal();
        try {
            await manager.authenticate(token);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(AccountStatusException);
            expect(e.token).to.be.equal(token);
        }
    });

    it('authenticate should re-throw AuthenticationException', async () => {
        const manager = new AuthenticationProviderManager([
            getAuthenticationProvider(true, AuthenticationException),
        ]);

        const token = this._prophet.prophesize(TokenInterface).reveal();
        try {
            await manager.authenticate(token);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(AuthenticationException);
            expect(e.token).to.be.equal(token);
        }
    });

    it('authenticate succeeds when one provider throws but not all', async () => {
        const authToken = this._prophet.prophesize(TokenInterface).reveal();
        const manager = new AuthenticationProviderManager([
            getAuthenticationProvider(true, AuthenticationException),
            getAuthenticationProvider(true, authToken),
        ]);

        const token = this._prophet.prophesize(TokenInterface).reveal();
        expect(await manager.authenticate(token)).to.be.equal(authToken);
    });

    it('authenticate returns token of the first matching provider', async () => {
        const authToken = this._prophet.prophesize(TokenInterface).reveal();
        const second = this._prophet.prophesize(AuthenticationProviderInterface);
        second.supports(Argument.cetera()).shouldNotBeCalled();

        const manager = new AuthenticationProviderManager([
            getAuthenticationProvider(true, authToken),
            second.reveal(),
        ]);

        const token = this._prophet.prophesize(TokenInterface).reveal();
        expect(await manager.authenticate(token)).to.be.equal(authToken);
    });

    it('eraseCredentials flag', async () => {
        const user = this._prophet.prophesize(UserInterface);
        let token = new UsernamePasswordToken(user.reveal(), 'bar', 'key');
        let manager = new AuthenticationProviderManager([ getAuthenticationProvider(true, token) ]);

        await manager.authenticate(this._prophet.prophesize(TokenInterface).reveal());
        expect(token.credentials).to.be.undefined;

        token = new UsernamePasswordToken(user.reveal(), 'bar', 'key');
        manager = new AuthenticationProviderManager([ getAuthenticationProvider(true, token) ], false);

        await manager.authenticate(this._prophet.prophesize(TokenInterface).reveal());
        expect(token.credentials).to.be.equal('bar');
    });

    it('authenticate dispatches authentication failure event', async () => {
        const exception = new AuthenticationException();
        const user = this._prophet.prophesize(UserInterface);
        const token = new UsernamePasswordToken(user.reveal(), 'bar', 'key');

        const provider = this._prophet.prophesize(AuthenticationProviderInterface);
        provider.supports(Argument.any()).willReturn(true);
        provider.authenticate(Argument.any()).willThrow(exception);

        const dispatcher = this._prophet.prophesize(Jymfony.Contracts.EventDispatcher.EventDispatcherInterface);
        dispatcher.dispatch(AuthenticationEvents.AUTHENTICATION_FAILURE, new AuthenticationFailureEvent(token, exception));

        const manager = new AuthenticationProviderManager([ provider.reveal() ]);
        manager.setEventDispatcher(dispatcher.reveal());

        try {
            await manager.authenticate(token);
        } catch (e) {
            expect(e.token).to.be.equals(token);
            return;
        }

        throw new Error('FAIL');
    });

    it('authenticate dispatches authentication event', async () => {
        const user = this._prophet.prophesize(UserInterface);
        const token = new UsernamePasswordToken(user.reveal(), 'bar', 'key');

        const provider = this._prophet.prophesize(AuthenticationProviderInterface);
        provider.supports(Argument.any()).willReturn(true);
        provider.authenticate(Argument.any()).willReturn(token);

        const dispatcher = this._prophet.prophesize(Jymfony.Contracts.EventDispatcher.EventDispatcherInterface);
        dispatcher.dispatch(AuthenticationEvents.AUTHENTICATION_SUCCESS, new AuthenticationEvent(token));

        const manager = new AuthenticationProviderManager([ provider.reveal() ]);
        manager.setEventDispatcher(dispatcher.reveal());

        expect(await manager.authenticate(token)).to.be.equals(token);
    });
});
