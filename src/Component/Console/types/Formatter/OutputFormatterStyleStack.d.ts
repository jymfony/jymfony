declare namespace Jymfony.Component.Console.Formatter {
    export class OutputFormatterStyleStack {
        /**
         * Computes current style with stacks top codes.
         */
        public readonly current: OutputFormatterStyleInterface;
        public emptyStyle: OutputFormatterStyleInterface;

        private _emptyStyle: OutputFormatterStyleInterface;
        private _styles: OutputFormatterStyleInterface[];

        /**
         * Constructor.
         */
        __construct(emptyStyle?: OutputFormatterStyleInterface | undefined): void;

        constructor(emptyStyle?: OutputFormatterStyleInterface | undefined);

        /**
         * Resets stack (ie. empty internal arrays).
         */
        reset(): void;

        /**
         * Pushes a style in the stack.
         */
        push(style: OutputFormatterStyleInterface): void;

        /**
         * Pops a style from the stack.
         *
         * @throws {InvalidArgumentException} When style tags incorrectly nested
         */
        pop(style?: OutputFormatterStyleInterface | undefined): OutputFormatterStyleInterface;
    }
}
