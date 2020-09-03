declare namespace Jymfony.Component.Testing.Framework {
    import Namespace = Jymfony.Component.Autoloader.Namespace;

    export class Runner {
        private _mocha: any;

        /**
         * Constructor.
         */
        __construct(mocha: any);

        /**
         * Run the test suite.
         */
        run(patterns?: string[]): void;

        /**
         * @internal
         */
        private _glob(pattern: string): IterableIterator<string>;

        /**
         * Finds classes into a namespace.
         */
        private _findClasses(namespace: Namespace, files: string[]): [ string[], string[] ];
    }
}
