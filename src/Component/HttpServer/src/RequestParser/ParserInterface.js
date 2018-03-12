/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 */
class ParserInterface {
    /**
     * Gets the request content buffer
     *
     * @returns {Buffer}
     */
    get buffer() { }

    /**
     * Parses the content of the request.
     *
     * @returns {Promise<Object<string, *>>}
     */
    parse() { }

    /**
     * Decodes a string buffer into a request param object.
     *
     * @param {string} buffer
     *
     * @returns {[Object<string, *>, Object<string, Jymfony.Component.HttpFoundation.File.UploadedFile>]}
     */
    decode(buffer) { }
}

module.exports = getInterface(ParserInterface);
