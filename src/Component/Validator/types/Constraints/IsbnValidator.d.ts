declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Isbn = Jymfony.Component.Validator.Constraints.Isbn;

    export class IsbnValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Isbn): void;

        /**
         * Validates ISBN 10.
         */
        protected _validateIsbn10(isbn: string): null | number;

        /**
         * Validates ISBN 13.
         */
        protected _validateIsbn13(isbn: string): null | number;

        /**
         * Gets the message associated to the given constraint.
         */
        protected _getMessage(constraint: Isbn, type?: null | string): string;
    }
}
