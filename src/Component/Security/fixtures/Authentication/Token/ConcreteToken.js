const AbstractToken = Jymfony.Component.Security.Authentication.Token.AbstractToken;

class ConcreteToken extends AbstractToken {
    __construct(user, roles = []) {
        super.__construct(roles);

        this.user = user;
        this._credentials = 'credentials_value';
    }

    get credentials() {
        // Empty
    }

    __sleep() {
        const fields = super.__sleep();
        fields.push('_credentials');

        return fields;
    }
}

module.exports = ConcreteToken;
