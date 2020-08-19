declare namespace Jymfony.Component.DependencyInjection.Argument {
    import Reference = Jymfony.Component.DependencyInjection.Reference;

    export class ReferenceSetArgumentTrait {
        public static readonly definition: Newable<ReferenceSetArgumentTrait>;

        /**
         * Array of references.
         */
        public values: Reference[];

        private _values: Reference[];
    }
}
