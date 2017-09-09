const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class RuntimeException extends mix(BaseException, ExceptionInterface) {
}

module.exports = RuntimeException;
