declare namespace Jymfony.Component.Config.Resource {
    export class EnvVariableResource extends implementationOf(SelfCheckingResourceInterface) {
        private _resource: string;
        private _name: string;

        /**
         * Constructor.
         */
        __construct(name: string): void;
        constructor(name: string);

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
