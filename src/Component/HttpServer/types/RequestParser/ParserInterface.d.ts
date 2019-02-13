declare namespace Jymfony.Component.HttpServer.RequestParser {
    export class ParserInterface implements MixinInterface {
        public static readonly definition: Newable<ParserInterface>;

        /**
         * Gets the request content buffer.
         */
        public readonly buffer: Buffer;

        /**
         * Parses the content of the request.
         */
        parse(): Promise<Record<string, any>>;
    }
}
