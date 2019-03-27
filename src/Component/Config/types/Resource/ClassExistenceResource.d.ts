declare namespace Jymfony.Component.Config.Resource {
    export class ClassExistenceResource extends implementationOf(SelfCheckingResourceInterface) {
        private _resource: Function;
        private _exists: boolean;

        /**
         * Constructor.
         */
        __construct(resource: Function): void;
        constructor(resource: Function);

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        isFresh(timestamp: number): boolean;
    }
}
