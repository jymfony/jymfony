declare namespace Jymfony.Component.DependencyInjection.Exception {
    export class ServiceNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(id: string, sourceId?: string): void;
        constructor(id: string, sourceId?: string);
    }
}
