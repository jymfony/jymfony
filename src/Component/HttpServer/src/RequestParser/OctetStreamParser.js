const AbstractParser = Jymfony.Component.HttpServer.RequestParser.AbstractParser;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 *
 * @internal
 *
 * @final
 */
export default class OctetStreamParser extends AbstractParser {
    /**
     * @inheritdoc
     */
    decode() {
        return [];
    }
}
