declare namespace Jymfony.Component.Metadata.Loader.Locator {
    export class IteratorFileLocator extends implementationOf(FileLocatorInterface) {
        /**
         * @inheritdoc
         */
        locate(basePath: string, extension: string): string[];

        /**
         * Iterate recursively the directories and yield matching files.
         */
        private _doLocate(basePath: string, extension: string): Generator<string>;
    }
}
