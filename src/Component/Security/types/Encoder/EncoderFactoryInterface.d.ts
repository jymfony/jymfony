declare namespace Jymfony.Component.Security.Encoder {
    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    /**
     * EncoderFactoryInterface to support different encoders for different accounts.
     */
    export class EncoderFactoryInterface {
        public static readonly definition: Newable<EncoderFactoryInterface>;

        /**
         * Returns the password encoder to use for the given account.
         *
         * @param user A UserInterface instance or a class name
         *
         * @throws {RuntimeException} when no password encoder could be found for the user
         */
        getEncoder(user: UserInterface | string): PasswordEncoderInterface;
    }
}
