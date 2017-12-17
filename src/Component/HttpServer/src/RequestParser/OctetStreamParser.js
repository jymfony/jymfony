const AbstractParser = Jymfony.Component.HttpServer.RequestParser.AbstractParser;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 * @internal
 * @final
 */
class OctetStreamParser extends AbstractParser {
    /**
     * @inheritDoc
     */
    decode() {
        return {};
    }
}

module.exports = OctetStreamParser;
