declare namespace Jymfony.Component.Security.Exception {
    /**
     * Thrown if the user account is locked.
     */
    export class LockedException extends AccountStatusException {
        /**
         * @inheritdoc
         */
        public readonly messageKey: string;
    }
}
