declare namespace Jymfony.Component.Debug.ErrorEnhancer {
    export class ErrorEnhancerInterface {
        public static readonly definition: Newable<ErrorEnhancerInterface>;

        /**
         * Returns an Error instance if the class is able to improve the error, null otherwise.
         */
        enhance(error: Error): null | Error;
    }
}
