declare namespace Jymfony.Component.Validator.Constraints {
    import Hostname = Jymfony.Component.Validator.Constraints.Hostname;
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;

    export class HostnameValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Hostname): void;

        /**
         * Checks if the hostname is valid.
         */
        private _isValid(domain: string): boolean;

        /**
         * Checks if tld is valid (and not reserved)
         */
        private _hasValidTld(domain: string): boolean;
    }
}
