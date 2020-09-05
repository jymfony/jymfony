declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import File = Jymfony.Component.Validator.Constraints.File;

    export class FileValidator extends ConstraintValidator {
        private static readonly suffices: Record<number, string>;

        /**
         * @inheritdoc
         */
        validate(value: any, constraint: File): Promise<void>;

        /**
         * Convert the limit to the smallest possible number
         * (i.e. try "MB", then "kB", then "bytes").
         */
        private _factorizeSizes(size: number, limit: number, binaryFormat: boolean): [string, string, string];
    }
}
