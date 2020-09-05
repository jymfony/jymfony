declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Ip = Jymfony.Component.Validator.Constraints.Ip;

    export class IpValidator extends ConstraintValidator {
        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Ip): void;

        /**
         * Checks if the given value is a reserved ip address.
         */
        private static _checkV4Reserved(value: Buffer): boolean;

        /**
         * Checks if the given value is a private ip address.
         */
        private static _checkV4Private(value: Buffer): boolean;

        /**
         * Checks if the given value is a reserved ip address.
         */
        private static _checkV6Reserved(value: Buffer): boolean;

        /**
         * Checks if the given value is a private ip address.
         */
        private static _checkV6Private(value: Buffer): boolean;

        private static _parseV4(address: string): Buffer;
        private static _parseV6(address: string): Buffer;

        /**
         * Checks if this ipv4 address matches with given address and netmask.
         */
        private static _checkV4(value: Buffer, address: string, netmask: number): boolean;

        /**
         * Checks if this ipv6 address matches with given address and netmask.
         */
        private static _checkV6(value: Buffer, address: string, netmask: number): boolean;

        private static _check(value: Buffer, address: Buffer, netmask: number): boolean;
    }
}
