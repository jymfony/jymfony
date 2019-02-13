declare namespace Jymfony.Component.Config.Definition.Exception {
    /**
     * This exception is thrown whenever the key of an array is not unique. This can
     * only be the case if the configuration is coming from an XML file.
     */
    export class DuplicateKeyException extends InvalidConfigurationException {
    }
}
