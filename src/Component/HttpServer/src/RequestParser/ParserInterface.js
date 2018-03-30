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
}

module.exports = getInterface(ParserInterface);
