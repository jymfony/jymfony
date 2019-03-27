declare namespace Jymfony.Component.Security.Exception {
    /**
     * Thrown if the user account credentials have expired.
     */
    export class CredentialsExpiredException extends AccountStatusException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
