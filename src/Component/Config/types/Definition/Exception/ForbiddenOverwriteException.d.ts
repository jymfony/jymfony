declare namespace Jymfony.Component.Config.Definition.Exception {
    /**
     * This exception is thrown when a configuration path is overwritten from a
     * subsequent configuration file, but the entry node specifically forbids this.
     */
    export class ForbiddenOverwriteException extends InvalidConfigurationException {
    }
}
