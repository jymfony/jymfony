declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Hostname extends Constraint {
        public static readonly INVALID_HOSTNAME_ERROR: string;

        public message: string;
        public requireTld: boolean;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Hostname>): this;
        constructor(options?: null | ConstraintOptions<Hostname>);
    }
}
