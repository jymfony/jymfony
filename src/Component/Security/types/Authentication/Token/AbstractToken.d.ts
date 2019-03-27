declare namespace Jymfony.Component.Security.Authentication.Token {
    import Role = Jymfony.Component.Security.Role.Role;
    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    /**
     * Base class for Token instances.
     */
    export abstract class AbstractToken extends implementationOf(TokenInterface) {
        private _authenticated: boolean;
        private _roles: Set<Role>;
        private _attributes: Record<string, any>;
        private _user: UserInterface | undefined;

        /**
         * Used in serialization.
         */
        private _rolesArray: Role[];

        /**
         * Constructor.
         */
        __construct(roles?: (Role | string)[]): void;
        constructor(roles?: (Role | string)[]);

        /**
         * @inheritdoc
         */
        public readonly roles: Role[];

        /**
         * @inheritdoc
         */
        public user: UserInterface | undefined;

        /**
         * @inheritdoc
         */
        public readonly username: string | null;

        /**
         * @inheritdoc
         */
        public authenticated: boolean;

        /**
         * @inheritdoc
         */
        eraseCredentials(): void;

        /**
         * @inheritdoc
         */
        public attributes: Record<string, any>;

        /**
         * @inheritdoc
         */
        hasAttribute(name: string): boolean;

        /**
         * @inheritdoc
         */
        getAttribute(name: string): any;

        /**
         * @inheritdoc
         */
        setAttribute(name: string, value: any): void;

        /**
         * @see __jymfony.serialize
         */
        __sleep(): string[];

        /**
         * @see __jymfony.unserialize
         */
        __wakeup(): void;

        /**
         * Checks whether the user that is being set is different from
         * the previous one.
         */
        private _hasUserChanged(user: UserInterface): boolean;

        /**
         * @inheritdoc
         */
        toString(): string;
    }
}
