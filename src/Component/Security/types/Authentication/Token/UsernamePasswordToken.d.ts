declare namespace Jymfony.Component.Security.Authentication.Token {
    import UserInterface = Jymfony.Component.Security.User.UserInterface;
    import Role = Jymfony.Component.Security.Role.Role;

    /**
     * UsernamePasswordToken implements a username and password token.
     */
    export class UsernamePasswordToken extends AbstractToken {
        private _credentials: any;
        private _providerKey: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(user: UserInterface, credentials: any, providerKey: string, roles?: (string | Role)[]): void;
        constructor(user: UserInterface, credentials: any, providerKey: string, roles?: (string | Role)[]);

        /**
         * @inheritdoc
         */
        public authenticated: boolean;

        /**
         * @inheritdoc
         */
        public readonly credentials: any;

        /**
         * Gets the provider key.
         */
        public readonly providerKey: string;

        /**
         * @inheritdoc
         */
        eraseCredentials(): void;

        /**
         * @inheritdoc
         */
        __sleep(): string[];
    }
}
