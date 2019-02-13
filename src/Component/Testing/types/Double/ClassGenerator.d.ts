declare namespace Jymfony.Component.Testing.Double {
    export class ClassGenerator {
        private _superClass: Constructor<any>;
        private _interfaces: Constructor<any>[];

        /**
         * Constructor.
         */
        __construct(superClass: Constructor<any>, interfaces: Constructor<any>[]): void;
        constructor(superClass: Constructor<any>, interfaces: Constructor<any>[]);

        generate(): Constructor<any>;
    }
}
