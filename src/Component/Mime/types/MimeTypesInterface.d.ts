declare namespace Jymfony.Component.Mime {
    export class MimeTypesInterface extends MimeTypeGuesserInterface.definition {
        public static readonly definition: Newable<MimeTypesInterface>;

        /**
         * Gets the extensions for the given MIME type.
         *
         * @returns An array of extensions (first one is the preferred one)
         */
        getExtensions(mimeType: string): string[];

        /**
         * Gets the MIME types for the given extension.
         *
         * @returns An array of MIME types (first one is the preferred one)
         */
        getMimeTypes(ext: string): string[];
    }
}
