declare namespace Jymfony.Component.Console.Formatter {
    export class OutputFormatter extends implementationOf(OutputFormatterInterface) {
        private _decorated: boolean;
        private _styles: Record<string, OutputFormatterStyleInterface>;
        private _styleStack: OutputFormatterStyleStack;

        static escape(text: string): string;
        static escapeTrailingBackslash(text: string): string;

        /**
         * Constructor.
         */
        __construct(decorated?: boolean, styles?: Record<string, OutputFormatterStyleInterface>): void;
        constructor(decorated?: boolean, styles?: Record<string, OutputFormatterStyleInterface>);

        /**
         * @inheritdoc
         */
        public decorated: boolean;

        /**
         * @inheritdoc
         */
        setStyle(name: string, style: OutputFormatterStyleInterface): void;

        /**
         * @inheritdoc
         */
        hasStyle(name: string): boolean;

        /**
         * @inheritdoc
         */
        getStyle(name: string): OutputFormatterStyleInterface;

        /**
         * @inheritdoc
         */
        format(message: string): string;

        /**
         * Applies current style from stack to text, if must be applied.
         */
        private _applyCurrentStyle(text: string): string;

        /**
         * Tries to create new style instance from string.
         *
         * @returns false if string is not format string
         */
        private _createStyleFromString(string: string): OutputFormatterStyleInterface|boolean;
    }
}
