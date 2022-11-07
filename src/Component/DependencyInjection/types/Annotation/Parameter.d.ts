declare namespace Jymfony.Component.DependencyInjection.Annotation {
    export class Parameter {
        private _parameterName: string;

        __construct(parameterName: string): void;
        constructor(parameterName: string);

        public readonly parameterName: string;
    }
}
