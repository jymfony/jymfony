/**
 * EncoderFactoryInterface to support different encoders for different accounts.
 *
 * @memberOf Jymfony.Component.Security.Encoder
 */
class EncoderFactoryInterface {
    /**
     * Returns the password encoder to use for the given account.
     *
     * @param {Jymfony.Component.Security.User.UserInterface|string} user A UserInterface instance or a class name
     *
     * @returns {Jymfony.Component.Security.Encoder.PasswordEncoderInterface}
     *
     * @throws {RuntimeException} when no password encoder could be found for the user
     */
    getEncoder(user) { }
}

module.exports = getInterface(EncoderFactoryInterface);
