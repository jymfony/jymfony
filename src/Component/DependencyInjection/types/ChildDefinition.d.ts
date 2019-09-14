declare namespace Jymfony.Component.DependencyInjection {
    export class ChildDefinition extends Definition {
        private _parent: string;
        private _replacedArguments: Record<number, any>;

        /**
         * Constructor.
         */
        __construct(parent: string | symbol | Function): void;
        constructor(parent: string | symbol | Function);

        /**
         * Gets the extended definition.
         */
        getParent(): Definition;

        /**
         * @inheritdoc
         */
        setArguments(args: any[]): this;

        /**
         * @inheritdoc
         */
        getArguments(): any[];

        /**
         * @inheritdoc
         */
        getArgument(index: number): any;

        /**
         * @inheritdoc
         */
        replaceArgument(index: number, argument: any): this;

        /**
         * @inheritdoc
         */
        setInstanceofConditionals(instanceOf: Record<string, ChildDefinition>): never;
    }
}
