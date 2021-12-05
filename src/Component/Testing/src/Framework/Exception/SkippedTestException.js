const Exception = Jymfony.Component.Testing.Framework.Exception.Exception;
const SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;

/**
 * @memberOf Jymfony.Component.Testing.Framework.Exception
 */
export default class SkippedTestException extends mix(Exception, SkipException) {
}
