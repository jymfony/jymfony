declare namespace Jymfony.Component.Security.User {
    /**
     * EquatableInterface used to test if two objects are equal in security
     * and re-authentication context.
     */
    export class EquatableInterface {
        public static readonly definition: Newable<EquatableInterface>;

        /**
         * The equality comparison should neither be done by referential equality
         * nor by comparing identities (i.e. getId() === getId()).
         *
         * However, you do not need to compare every attribute, but only those that
         * are relevant for assessing whether re-authentication is required.
         */
        isEqualTo(user: UserInterface): boolean;
    }
}
