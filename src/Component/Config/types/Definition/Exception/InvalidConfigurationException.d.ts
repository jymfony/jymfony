declare namespace Jymfony.Component.Config.Definition.Exception {
    /**
     * A very general exception which can be thrown whenever non of the more specific
     * exceptions is suitable.
     */
    export class InvalidConfigurationException extends Exception {
        setPath(path: string): void;
        getPath(): string;

        /**
         * Adds extra information that is suffixed to the original exception message.
         */
        addHint(hint: string): void;
    }
}
