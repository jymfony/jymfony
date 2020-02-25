declare namespace Jymfony.Component.Kernel {
    /**
     * Contains all events dispatched by a Kernel.
     *
     * @final
     */
    export class KernelEvents {
        /**
         * The UNHANDLED_REJECTION event occurs when an unhandled promise rejection appears.
         *
         * This event allows you to deal with the exception/error or
         * to modify the thrown exception.
         */
        public static readonly UNHANDLED_REJECTION = 'kernel.unhandled_rejection';
    }
}
