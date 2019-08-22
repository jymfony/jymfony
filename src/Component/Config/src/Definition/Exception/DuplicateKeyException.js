const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;

/**
 * This exception is thrown whenever the key of an array is not unique. This can
 * only be the case if the configuration is coming from an XML file.
 *
 * @memberOf Jymfony.Component.Config.Definition.Exception
 */
export default class DuplicateKeyException extends InvalidConfigurationException {
}
