const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;

/**
 * Exception thrown when no routes are configured.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
class NoConfigurationException extends ResourceNotFoundException {
}

module.exports = NoConfigurationException;
