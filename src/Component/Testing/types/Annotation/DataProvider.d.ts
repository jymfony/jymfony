declare namespace Jymfony.Component.Testing.Annotation {
    interface DataProviderConstructor {
        (provider: string): <T>(value: T, context: any) => T;
        new (provider: string): DataProviderImpl;
    }

    class DataProviderImpl {
        private _provider: string;

        /**
         * Constructor.
         */
        __construct(provider: string): void;
        constructor(provider: string);

        /**
         * Gets the provider method name.
         */
        public readonly provider: string;
    }

    export var DataProvider: DataProviderConstructor & DataProviderImpl;
}
