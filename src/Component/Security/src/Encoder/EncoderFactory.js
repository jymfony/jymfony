const EncoderAwareInterface = Jymfony.Component.Security.Encoder.EncoderAwareInterface;
const EncoderFactoryInterface = Jymfony.Component.Security.Encoder.EncoderFactoryInterface;
const MessageDigestPasswordEncoder = Jymfony.Component.Security.Encoder.MessageDigestPasswordEncoder;
const PasswordEncoderInterface = Jymfony.Component.Security.Encoder.PasswordEncoderInterface;
const PlaintextPasswordEncoder = Jymfony.Component.Security.Encoder.PlaintextPasswordEncoder;

/**
 * EncoderFactoryInterface to support different encoders for different accounts.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 */
export default class EncoderFactory extends implementationOf(EncoderFactoryInterface) {
    /**
     * Constructor.
     *
     * @param {Object.<string, Jymfony.Component.Security.Encoder.PasswordEncoderInterface>} encoders
     */
    __construct(encoders) {
        /**
         * @type {Object<string, *|Jymfony.Component.Security.Encoder.PasswordEncoderInterface>}
         *
         * @private
         */
        this._encoders = encoders;
    }

    /**
     * @inheritdoc
     */
    getEncoder(user) {
        let encoderKey, encoderName;

        if (user instanceof EncoderAwareInterface && (encoderName = user.encoderName)) {
            if (! this._encoders.hasOwnProperty(encoderName)) {
                throw new RuntimeException(__jymfony.sprintf('The encoder "%s" was not configured.', encoderName));
            }

            encoderKey = encoderName;
        } else {
            const reflClass = new ReflectionClass(user);
            for (const class_ of Object.keys(this._encoders)) {
                if (reflClass.isInstanceOf(class_)) {
                    encoderKey = class_;
                    break;
                }
            }
        }

        if (! encoderKey) {
            throw new RuntimeException(__jymfony.sprintf('No encoder has been configured for account "%s".', isString(user) ? user : ReflectionClass.getClassName(user)));
        }

        if (! (this._encoders[encoderKey] instanceof PasswordEncoderInterface)) {
            this._encoders[encoderKey] = this._createEncoder(this._encoders[encoderKey]);
        }

        return this._encoders[encoderKey];
    }

    /**
     * Creates the actual encoder instance.
     *
     * @param {*} config Configuration parameters.
     *
     * @returns {Jymfony.Component.Security.Encoder.PasswordEncoderInterface}
     *
     * @throws {InvalidArgumentException}
     */
    _createEncoder(config) {
        if (config.algorithm) {
            config = this._getEncoderConfigFromAlgorithm(config);
        }

        if (! config.class) {
            throw new InvalidArgumentException(__jymfony.sprintf('"class" must be set in %s.', JSON.stringify(config)));
        }

        if (! config['arguments']) {
            throw new InvalidArgumentException(__jymfony.sprintf('"arguments" must be set in %s.', JSON.stringify(config)));
        }

        return new ReflectionClass(config.class).newInstance(...config['arguments']);
    }

    /**
     * Gets encoder configuration object from algo name.
     *
     * @param {Object.<string, *>} config
     *
     * @returns {Object.<string, *>}
     *
     * @private
     */
    _getEncoderConfigFromAlgorithm(config) {
        switch (config.algorithm) {
            case 'plaintext':
                return {
                    'class': PlaintextPasswordEncoder,
                    'arguments': [ config.ignore_case ],
                };
        }

        return {
            'class': MessageDigestPasswordEncoder,
            'arguments': [
                config.algorithm,
                config.encode_as_base64,
                config.iterations,
            ],
        };
    }
}

module.exports = EncoderFactory;
