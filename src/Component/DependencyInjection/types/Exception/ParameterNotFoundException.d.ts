declare namespace Jymfony.Component.DependencyInjection.Exception {
    export class ParameterNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
        public /* writeonly */ sourceId: string;
        public /* writeonly */ sourceKey: string;

        private _key: string;
        private _sourceId?: string;
        private _sourceKey?: string;

        /**
         * Constructor.
         */
        __construct(key: string, sourceId?: string, sourceKey?: boolean): void;
        constructor(key: string, sourceId?: string, sourceKey?: boolean);

        /**
         * @private
         */
        private _updateMsg(): void;
    }
}
