declare namespace Jymfony.Component.Testing.Constraints {
    export class HasKey extends Constraint {
        private _key: any;

        /**
         * Constructor.
         */
        __construct(key: any): void;
        constructor(key: any);

        /**
         * @inheritDoc
         */
        toString(): string;

        /**
         * @inheritDoc
         */
        matches(other: any): boolean;

        /**
         * @inheritDoc
         */
        protected _failureDescription(other: any): string;
    }
}
