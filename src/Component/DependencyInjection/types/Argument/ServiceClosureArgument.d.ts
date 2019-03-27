declare namespace Jymfony.Component.DependencyInjection.Argument {
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    export class ServiceClosureArgument extends implementationOf(ArgumentInterface) {
        public values: [Reference];
        private _values: [Reference];

        /**
         * Constructor.
         */
        __construct(reference: Reference): void;
        constructor(reference: Reference);
    }
}
