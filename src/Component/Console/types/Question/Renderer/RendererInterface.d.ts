declare namespace Jymfony.Component.Console.Question.Renderer {
    /**
     * An abstract renderer.
     *
     * @internal
     */
    export class RendererInterface {
        public static readonly definition: Newable<RendererInterface>;

        /**
         * Gets the promise resolve callback.
         */
        doAsk(): Promise<any>;
    }
}
