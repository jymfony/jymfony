declare namespace Jymfony.Component.HttpServer.RequestParser {
    import UploadedFile = Jymfony.Component.HttpFoundation.File.UploadedFile;

    /**
     * @internal
     *
     * @final
     */
    export class OctetStreamParser extends AbstractParser {
        /**
         * @inheritdoc
         */
        decode(): Record<string, any | UploadedFile>[];
    }
}
