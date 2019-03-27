declare namespace Jymfony.Component.DependencyInjection {
    export class Reference {
        public readonly invalidBehavior: number;

        /**
         * Constructor.
         */
        __construct(id: string | symbol | Function, invalidBehavior?: number): void;
        constructor(id: string | symbol | Function, invalidBehavior?: number);

        toString(): string
    }
}
