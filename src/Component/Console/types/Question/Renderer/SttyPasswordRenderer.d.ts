declare namespace Jymfony.Component.Console.Question.Renderer {
    /**
     * Renders a PasswordQuestion prompt using stty to hide
     * password or echo.
     * This class is internal and should be considered private
     * DO NOT USE this directly.
     *
     * @internal
     */
    export class SttyPasswordRenderer extends AbstractRenderer {
        /**
         * @inheritdoc
         */
        doAsk(): Promise<string>;
    }
}
