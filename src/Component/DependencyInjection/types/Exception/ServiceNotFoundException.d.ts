declare namespace Jymfony.Component.DependencyInjection.Exception {
    import NotFoundExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.NotFoundExceptionInterface;

    export class ServiceNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(id: string, sourceId?: string): void;
        constructor(id: string, sourceId?: string);
    }
}
