declare namespace Jymfony.Component.Validator.Constraints {
    export class NumberConstraintTrait {
        public static readonly definition: Newable<NumberConstraintTrait>;

        /**
         * @private
         */
        private _configureNumberConstraintOptions(options: ConstraintOptions<this>): ConstraintOptions<this>;
    }
}
