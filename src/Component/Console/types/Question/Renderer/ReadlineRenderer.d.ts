declare namespace Jymfony.Component.Console.Question.Renderer {
    /**
     * Renders a Question prompt using readline.
     *
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class ReadlineRenderer extends AbstractRenderer {
        /**
         * @inheritdoc
         */
        doAsk(): Promise<string>;
    }
}
