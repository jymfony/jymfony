declare namespace Jymfony.Component.Testing.Double {
    export class ClassGenerator {
        private _superClass: Newable;
        private _interfaces: Newable[];

        /**
         * Constructor.
         */
        __construct(superClass: Newable, interfaces: Newable[]): void;
        constructor(superClass: Newable, interfaces: Newable[]);

        generate(): Newable;
    }
}
