declare namespace Jymfony.Component.Security.Encoder {
    /**
     * PlaintextPasswordEncoder does not do any encoding.
     */
    export class PlaintextPasswordEncoder extends AbstractPasswordEncoder {
        private _ignoreCase: boolean;

        /**
         * Constructor.
         */
        __construct(ignorePasswordCase?: boolean): void;
        constructor(ignorePasswordCase?: boolean);

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
