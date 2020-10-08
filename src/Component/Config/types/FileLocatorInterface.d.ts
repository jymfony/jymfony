declare namespace Jymfony.Component.Config {
    export class FileLocatorInterface {
        public static readonly definition: Newable<FileLocatorInterface>;

        /**
         * Returns a full path for a given file name.
         *
         * @param name The file name to locate
         * @param currentPath The current path
         * @param first Whether to return the first occurrence or an array of filenames
         *
         * @returns The full path to the file or an array of file paths
         *
         * @throws {InvalidArgumentException} If name is empty
         * @throws {Jymfony.Component.Config.Exception.FileLocatorFileNotFoundException} If a file is not found
         */
        locate(name: string, currentPath?: undefined|string, first?: boolean): string|string[];
    }
}
