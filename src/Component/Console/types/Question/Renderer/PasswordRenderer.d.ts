declare namespace Jymfony.Component.Console.Question.Renderer {
    import Question = Jymfony.Component.Console.Question.Question;

    /**
     * Renders a PasswordQuestion prompt using stdin in raw mode
     * to hide password or echo.
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class PasswordRenderer extends AbstractRenderer {
        /**
         * Carriage-Return received.
         */
        private _cr: boolean;

        /**
         * Received data buffer.
         */
        private _buffer: Buffer;

        /**
         * @inheritdoc
         */
        __construct(question: Question): void;
        constructor(question: Question);

        /**
         * @inheritdoc
         */
        doAsk(): Promise<string>;

        private _resolve(): void;

        /**
         * Callback for stream "data" event.
         */
        private _onData(data: Buffer): void;

        private _onChar(char: string): void;
    }
}
