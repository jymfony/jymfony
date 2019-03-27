declare namespace Jymfony.Component.Config {
    export class FileLocator extends implementationOf(FileLocatorInterface) {
        private _paths: string[];

        /**
         * Constructor.
         */
        __construct(paths: string|string[]): void;
        constructor(paths: string|string[]);

        /**
         * @inheritdoc
         */
        locate(name: string, currentPath?: undefined|string, first?: boolean): string|string[];
    }
}
