/**
 * Guesses the MIME type of a file.
 *
 * @memberOf Jymfony.Component.Mime
 */
class MimeTypeGuesserInterface {
    /**
     * Returns true if this guesser is supported.
     *
     * @returns {boolean}
     */
    isGuesserSupported() {}

    /**
     * Guesses the MIME type of the file with the given path.
     *
     * @param {string} path The path to the file
     *
     * @returns {Promise<string|null>} The MIME type or null, if none could be guessed
     *
     * @throws {LogicException}           If the guesser is not supported
     * @throws {InvalidArgumentException} If the file does not exist or is not readable
     */
    async guessMimeType(path) { }
}

export default getInterface(MimeTypeGuesserInterface);
