declare namespace Jymfony.Component.Config.Resource {
    export class FileResource extends implementationOf(SelfCheckingResourceInterface) {
        /**
         * Constructor.
         */
        __construct(resource: any): void;
        constructor(resource: any);

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
