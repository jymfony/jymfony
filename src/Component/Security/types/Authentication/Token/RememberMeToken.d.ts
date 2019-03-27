declare namespace Jymfony.Component.Security.Authentication.Token {

    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    /**
     * Authentication Token for "Remember-Me".
     */
    export class RememberMeToken extends AbstractToken {
        private _providerKey: string;
        private _secret: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(user: UserInterface, providerKey: string, secret: string): void;
        constructor(user: UserInterface, providerKey: string, secret: string);

        /**
         * @inheritdoc
         */
        public authenticated: boolean;

        /**
         * @inheritdoc
         */
        public readonly credentials: null;

        /**
         * Gets the provider key.
         */
        public readonly providerKey: string;

        /**
         * Gets the token' secret.
         */
        public readonly secret: string;

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
