declare namespace Jymfony.Component.Security.Exception {
    /**
     * Thrown if the user account has expired.
     */
    export class AccountExpiredException extends AccountStatusException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
