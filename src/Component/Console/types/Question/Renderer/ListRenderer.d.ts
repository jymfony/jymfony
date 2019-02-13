declare namespace Jymfony.Component.Console.Question.Renderer {
    import Choice = Jymfony.Component.Console.Question.Choice;
    import Question = Jymfony.Component.Console.Question.Question;

    /**
     * Renders a ChoiceQuestion as list.
     *
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class ListRenderer extends AbstractRenderer {
        /**
         * Current selected index.
         */
        protected _current: number;

        /**
         * Prompt lines.
         */
        private _linesCount?: number;

        /**
         * Carriage-Return received.
         */
        private _cr: boolean;

        /**
         * Input data event listener.
         */
        private _dataCallback: Invokable;

        /**
         * @inheritdoc
         */
        __construct(question: Question): void;
        constructor(question: Question);

        /**
         * @inheritdoc
         */
        doAsk(): Promise<any>;

        /**
         * Input stream data event handler.
         */
        protected _onData(data: Buffer): void;

        /**
         * Renders a choice label.
         */
        protected _renderChoice(choice: Choice, key: number): string;

        /**
         * Gets the current choice value(s).
         */
        protected _getValue(): any;

        /**
         * Print prompt
         */
        protected _print(): void;

        /**
         * Resolve promise.
         */
        private _resolve(): void;
    }
}
