declare namespace Jymfony.Contracts.Debug.ErrorRenderer {
    import FlattenExceptionInterface = Jymfony.Contracts.Debug.Exception.FlattenExceptionInterface;

    /**
     * Formats an exception to be used as response content.
     */
    class ErrorRendererInterface {
        public static readonly definition: Newable<ErrorRendererInterface>;

        /**
         * Renders an Error as a FlattenExceptionInterface.
         */
        render(exception: Error): FlattenExceptionInterface;
    }
}
