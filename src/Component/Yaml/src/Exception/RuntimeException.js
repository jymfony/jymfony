const ExceptionInterface = Jymfony.Component.Yaml.Exception.ExceptionInterface;

/**
 * Exception class thrown when an error occurs during parsing.
 *
 * @memberOf Jymfony.Component.Yaml.Exception
 */
export default class RuntimeException extends mix(global.RuntimeException, ExceptionInterface) {
}
