const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
class RuntimeException extends mix(BaseException, ExceptionInterface) {
}

module.exports = RuntimeException;
