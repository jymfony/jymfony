declare namespace Jymfony.Component.Config.Resource {
    export class ReflectionClassResource extends implementationOf(SelfCheckingResourceInterface) {
        private _className: string;
        private _classReflector: ReflectionClass;
        private _files: string[];
        private _hash: string;

        /**
         * Constructor.
         */
        __construct(classReflector: ReflectionClass): void;
        constructor(classReflector: ReflectionClass);

        /**
         * @inheritdoc
         */
        isFresh(timestamp: number): boolean;

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @internal
         */
        __sleep(): string[];

        private _loadFiles(Class: ReflectionClass): void;
        private _computeHash(): string;
        private _generateSignature(Class): IterableIterator<string>;
    }
}
