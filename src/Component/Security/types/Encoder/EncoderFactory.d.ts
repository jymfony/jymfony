declare namespace Jymfony.Component.Security.Encoder {
    import UserInterface = Jymfony.Component.Security.User.UserInterface;

    type EncoderConfiguration = {
        algorithm: 'plaintext',
        ignore_case?: boolean,
    } | {
        algorithm: string,
        encode_as_base64: boolean,
        iterations: number,
    }

    /**
     * EncoderFactoryInterface to support different encoders for different accounts.
     */
    export class EncoderFactory extends implementationOf(EncoderFactoryInterface) {
        private _encoders: Record<string, PasswordEncoderInterface>;

        /**
         * Constructor.
         */
        __construct(encoders: Record<string, PasswordEncoderInterface>): void;
        constructor(encoders: Record<string, PasswordEncoderInterface>);

        /**
         * @inheritdoc
         */
        getEncoder(user: UserInterface): PasswordEncoderInterface;

        /**
         * Creates the actual encoder instance.
         *
         * @throws {InvalidArgumentException}
         */
        private _createEncoder(config: EncoderConfiguration);

        /**
         * Gets encoder configuration object from algo name.
         */
        private _getEncoderConfigFromAlgorithm(config: EncoderConfiguration): any;
    }
}
