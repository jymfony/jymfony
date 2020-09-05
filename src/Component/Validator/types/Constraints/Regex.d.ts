declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    export class Regex extends Constraint {
        public static readonly REGEX_FAILED_ERROR: string;

        public message: string;
        public pattern?: RegExp;
        public htmlPattern?: string;
        public match: boolean;
        public normalizer?: (arg: string) => string;

        /**
         * @inheritdoc
         */
        static getErrorName(errorCode: string): string;

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Regex>): this;
        constructor(options?: null | ConstraintOptions<Regex>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;

        /**
         * @inheritdoc
         */
        public readonly requiredOptions: string[];

        /**
         * Converts the htmlPattern to a suitable format for HTML5 pattern.
         * Example: /^[a-z]+$/ would be converted to [a-z]+
         * However, if options are specified, it cannot be converted.
         *
         * Pattern is also ignored if match=false since the pattern should
         * then be reversed before application.
         *
         * @see http://dev.w3.org/html5/spec/single-page.html#the-pattern-attribute
         */
        getHtmlPattern(): null | string;
    }
}
