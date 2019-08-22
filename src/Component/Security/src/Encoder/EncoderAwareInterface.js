/**
 * @memberOf Jymfony.Component.Security.Encoder
 */
class EncoderAwareInterface {
    /**
     * Gets the name of the encoder used to encode the password.
     *
     * If the method returns null, the standard way to retrieve the encoder
     * will be used instead.
     *
     * @returns {string}
     */
    get encoderName();
}

export default getInterface(EncoderAwareInterface);
