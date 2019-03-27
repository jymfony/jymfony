declare namespace Jymfony.Component.HttpServer.RequestParser {
    import UploadedFile = Jymfony.Component.HttpFoundation.File.UploadedFile;

    /**
     * @internal
     *
     * @final
     */
    export class UrlEncodedParser extends AbstractParser {
        /**
         * @inheritdoc
         */
        decode(buffer: string): Record<string, any | UploadedFile>[];
    }
}
