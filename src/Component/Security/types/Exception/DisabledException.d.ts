declare namespace Jymfony.Component.Security.Exception {
    /**
     * Thrown if the user account is disabled.
     */
    export class DisabledException extends AccountStatusException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
