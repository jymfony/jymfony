declare namespace Jymfony.Component.Debug.ErrorRenderer {
    /**
     * Formats an exception to be used as response content.
     */
    export class ErrorRendererInterface implements MixinInterface {
        public static readonly definition: Newable<ErrorRendererInterface>;

        /**
         * Renders an Error as a FlattenException.
         */
        render(exception: Error): FlattenException;
    }
}
