declare namespace Jymfony.Component.Console.Formatter {
    export class OutputFormatterStyle extends implementationOf(OutputFormatterStyleInterface) {
        /**
         * @inheritdoc
         */
        public /* writeonly */ foreground: string|null|undefined;

        /**
         * @inheritdoc
         */
        public /* writeonly */ background: string|null|undefined;

        /**
         * @inheritdoc
         */
        public /* writeonly */ href: string|undefined;

        private _options: Set<any>;
        private _background?: any;
        private _foreground?: any;
        private _href?: string;

        /**
         * Constructor.
         */
        __construct(foreground?: string|undefined, background?: string|undefined, options?: string[]): void;
        constructor(foreground?: string|undefined, background?: string|undefined, options?: string[]);

        /**
         * @inheritdoc
         */
        setOption(option: string): void;

        /**
         * @inheritdoc
         */
        unsetOption(option: string): void;

        /**
         * @inheritdoc
         */
        setOptions(options: string[]): void;

        /**
         * @inheritdoc
         */
        apply(text: string): string;
    }
}
