declare namespace Jymfony.Component.Security.Role {
    /**
     * Represents a user role identified by a string.
     * Role objects are unique for each role identifier.
     */
    export class Role {
        private _role: string;

        /**
         * Constructor.
         */
        __construct(role: string): void;
        constructor(role: string);

        /**
         * Gets the role identifier.
         */
        public readonly role: string;

        /**
         * Gets the string representation of this role (the identifier).
         */
        toString(): string;
    }
}
