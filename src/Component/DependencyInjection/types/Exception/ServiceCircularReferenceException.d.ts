declare namespace Jymfony.Component.DependencyInjection.Exception {
    export class ServiceCircularReferenceException extends RuntimeException {
        public readonly serviceId: string;
        public readonly path: string[];

        private _serviceId: string;
        private _path: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(id: string, path: string|string[]): void;
        constructor(id: string, path: string|string[]);
    }
}
