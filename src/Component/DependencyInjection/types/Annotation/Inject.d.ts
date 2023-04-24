declare namespace Jymfony.Component.DependencyInjection.Annotation {
    export class Inject {
        private _serviceId: string;
        private _invalidBehavior: number | undefined;

        __construct(serviceId: string, invalidBehavior?: number): void;
        constructor(serviceId: string, invalidBehavior?: number);

        public readonly serviceId: string;
        public readonly invalidBehavior: number | undefined;
    }
}
