declare namespace Jymfony.Component.Security.Authentication.Token {
    import Role = Jymfony.Component.Security.Role.Role;
    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    /**
     * TokenInterface is the interface for the user authentication information.
     */
    export class TokenInterface {
        public static readonly definition: Newable<TokenInterface>;

        /**
         * Gets a string representation of the Token.
         * This is only to be used for debugging purposes.
         */
        toString(): string;

        /**
         * Gets the user roles.
         */
        public readonly roles: Role[];

        /**
         * Gets the user presented credentials or null.
         *
         * @returns The user credentials
         */
        public readonly credentials: any;

        /**
         * Gets/sets the user, if any.
         */
        public user: UserInterface | undefined;

        /**
         * Gets the username.
         */
        public readonly username: string | null;

        /**
         * Gets/sets the authenticated flag.
         */
        public authenticated: boolean;

        /**
         * Removes sensitive information from the token.
         */
        eraseCredentials(): void;

        /**
         * Gets/sets the token attributes.
         */
        public attributes: Record<string, any>;

        /**
         * Checks whether the given attribute exists.
         *
         * @param name The attribute name
         *
         * @returns true if the attribute exists, false otherwise
         */
        hasAttribute(name: string): boolean;

        /**
         * Gets an attribute value.
         *
         * @param name The attribute name
         *
         * @returns The attribute value
         *
         * @throws {InvalidArgumentException} When attribute doesn't exist for this token
         */
        getAttribute(name: string): any;

        /**
         * Sets an attribute.
         *
         * @param name The attribute name
         * @param value The attribute value
         */
        setAttribute(name: string, value: any): void;
    }
}
