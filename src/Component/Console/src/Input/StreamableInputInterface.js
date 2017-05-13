const InputInterface = Jymfony.Component.Console.Input.InputInterface;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
class StreamableInputInterface extends InputInterface.definition {
    /**
     * Sets the input stream to read from when interacting with the user.
     *
     * This is mainly useful for testing purpose.
     *
     * @param {stream.Readable} stream The input stream
     */
    set stream(stream) { }

    /**
     * Returns the input stream.
     *
     * @returns {stream.Readable|undefined}
     */
    get stream() { }
}

module.exports = getInterface(StreamableInputInterface);
