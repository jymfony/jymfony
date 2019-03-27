declare namespace Jymfony.Component.DependencyInjection.Exception {
    export class ServiceNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
        /**
         * Constructor.
         */
        __construct(id: string, sourceId?: string): void;
        constructor(id: string, sourceId?: string);
    }
}
