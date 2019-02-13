declare namespace Jymfony.Component.Security.Encoder {
    /**
     * Represents a password encoder.
     */
    export class PasswordEncoderInterface implements MixinInterface {
        public static readonly definition: Newable<PasswordEncoderInterface>;

        /**
         * Encodes the raw password.
         *
         * @param raw The password to encode
         * @param salt The salt
         *
         * @returns The encoded password
         */
        encodePassword(raw: string, salt: string): Promise<string>;

        /**
         * Checks a raw password against an encoded password.
         *
         * @param encoded An encoded password
         * @param raw A raw password
         * @param salt The salt
         *
         * @returns true if the password is valid, false otherwise
         */
        isPasswordValid(encoded: string, raw: string, salt: string): Promise<boolean>;
    }
}
