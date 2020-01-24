declare namespace Jymfony.Component.Metadata.Loader.Locator {
    export class FileLocatorInterface extends MixinInterface {
        public static readonly definition: Newable<FileLocatorInterface>;

        /**
         * Find all files matching $extension extension
         * NOTE: extension MUST start with a dot (.).
         */
        locate(basePath: string, extension: string): string[];
    }
}
