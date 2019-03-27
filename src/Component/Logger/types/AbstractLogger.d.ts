declare namespace Jymfony.Component.Logger {
    export abstract class AbstractLogger extends implementationOf(LoggerInterface) {
        /**
         * @inheritdoc
         */
        emergency(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        alert(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        critical(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        error(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        warning(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        notice(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        info(message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        debug(message: string, context: Record<string, any>): void;
    }
}
