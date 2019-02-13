declare namespace Jymfony.Component.Security.Encoder {
    /**
     * PlaintextPasswordEncoder does not do any encoding.
     */
    export class MessageDigestPasswordEncoder extends AbstractPasswordEncoder {
        private _algorithm: string;
        private _encodeAsBase64: boolean;
        private _iterations: number;

        /**
         * Constructor.
         *
         * @param [algorithm = 'sha512'] The digest algorithm to use
         * @param [encodeHashAsBase64 = true] Whether to base64 encode the password hash
         * @param [iterations = 5000] The number of iterations to use to stretch the password hash
         */
        __construct(algorithm?: string, encodeHashAsBase64?: boolean, iterations?: number): void;
        constructor(algorithm?: string, encodeHashAsBase64?: boolean, iterations?: number);

        /**
         * @inheritdoc
         */
        encodePassword(raw: string, salt: string): Promise<string>;

        /**
         * @inheritdoc
         */
        isPasswordValid(encoded: string, raw: string, salt: string): Promise<boolean>;
    }
}
