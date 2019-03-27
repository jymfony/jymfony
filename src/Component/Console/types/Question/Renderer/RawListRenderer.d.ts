declare namespace Jymfony.Component.Console.Question.Renderer {
    /**
     * Renders a ChoiceQuestion prompt as ordered list.
     *
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class RawListRenderer extends AbstractRenderer {
        /**
         * @inheritdoc
         */
        doAsk(): Promise<any>;

        /**
         * @private
         */
        private _print(): void;
    }
}
