declare namespace Jymfony.Component.Security.Encoder {
    /**
     * Base class for all the password encoders.
     */
    export abstract class AbstractPasswordEncoder extends implementationOf(PasswordEncoderInterface) {
        /**
         * Merges a password and a salt.
         */
        protected _mergePasswordAndSalt(password: string, salt: string): string;

        /**
         * Compares two password.
         * This method uses a constant-time comparison algorithm
         * to avoid timing attacks.
         */
        protected _comparePasswords(first: string, second: string): boolean;
    }
}
