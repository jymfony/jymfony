declare namespace Jymfony.Component.HttpServer.Controller {
    import ControllerArgumentMetadata = Jymfony.Component.HttpServer.Controller.Metadata.ControllerArgumentMetadata;
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Responsible for resolving the value of an argument based on its metadata.
     */
    export class ArgumentValueResolverInterface extends MixinInterface {
        public static readonly definition: Newable<ArgumentValueResolverInterface>;

        /**
         * Whether this resolver can resolve the value for the given ReflectionParameter.
         */
        supports(request: RequestInterface, argument: ControllerArgumentMetadata): boolean

        /**
         * Returns the possible value(s).
         */
        resolve(request: RequestInterface, argument: ControllerArgumentMetadata): Iterable<any> | IterableIterator<any> | Iterator<any> | AsyncIterable<any> | AsyncIterableIterator<any> | AsyncIterator<any>;
    }
}
