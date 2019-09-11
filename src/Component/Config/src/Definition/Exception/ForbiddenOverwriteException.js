const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;

/**
 * This exception is thrown when a configuration path is overwritten from a
 * subsequent configuration file, but the entry node specifically forbids this.
 *
 * @memberOf Jymfony.Component.Config.Definition.Exception
 */
export default class ForbiddenOverwriteException extends InvalidConfigurationException {
}
