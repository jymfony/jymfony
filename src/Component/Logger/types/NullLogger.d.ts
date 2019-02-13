declare namespace Jymfony.Component.Logger {
    export class NullLogger extends AbstractLogger {
        /**
         * This logger do nothing.
         */
        log(): void;
    }
}
