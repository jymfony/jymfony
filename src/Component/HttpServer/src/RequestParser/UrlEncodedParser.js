const AbstractParser = Jymfony.Component.HttpServer.RequestParser.AbstractParser;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 *
 * @internal
 *
 * @final
 */
class UrlEncodedParser extends AbstractParser {
    /**
     * @inheritdoc
     */
    decode(buffer) {
        return __jymfony.parse_query_string(buffer.toString());
    }
}

module.exports = UrlEncodedParser;
