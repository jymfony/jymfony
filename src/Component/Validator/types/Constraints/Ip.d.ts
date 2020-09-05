declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Ip extends Constraint {
        public static readonly INVALID_IP_ERROR: string;
        public static readonly V4: string;
        public static readonly V6: string;
        public static readonly ALL: string;

        public static readonly V4_NO_PRIV: string;
        public static readonly V6_NO_PRIV: string;
        public static readonly ALL_NO_PRIV: string;

        public static readonly V4_NO_RES: string;
        public static readonly V6_NO_RES: string;
        public static readonly ALL_NO_RES: string;

        public static readonly V4_ONLY_PUBLIC: string;
        public static readonly V6_ONLY_PUBLIC: string;
        public static readonly ALL_ONLY_PUBLIC: string;

        public message: string;
        public version: string;
        public normalizer?: (value: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Ip>): this;
        constructor(options?: null | ConstraintOptions<Ip>);

        protected static readonly _versions: string[];
    }
}
