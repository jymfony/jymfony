const Exception = Jymfony.Component.Config.Definition.Exception.Exception;

/**
 * This exception is usually not encountered by the end-user, but only used
 * internally to signal the parent scope to unset a key.
 *
 * @memberOf Jymfony.Component.Config.Definition.Exception
 */
export default class UnsetKeyException extends Exception {
}
