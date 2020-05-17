declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class AliasDeprecatedPublicServicesPass extends AbstractRecursivePass {
        private _tagName: string;
        private _aliases: Record<string, string>;

        /**
         * Constructor.
         */
        __construct(tagName?: string): void;
        constructor(tagName?: string);

        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
