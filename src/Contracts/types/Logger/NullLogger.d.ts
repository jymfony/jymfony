declare namespace Jymfony.Contracts.Logger {
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

    export class NullLogger extends implementationOf(LoggerInterface) {
        /**
         * @inheritdoc
         */
        emergency(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        alert(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        critical(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        error(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        warning(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        notice(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        info(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        debug(message: string, context?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        log(level: number, message: string, context?: Record<string, any>): void;
    }
}
