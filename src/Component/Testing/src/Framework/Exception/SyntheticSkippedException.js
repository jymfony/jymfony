const SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;
const SyntheticException = Jymfony.Component.Testing.Framework.Exception.SyntheticException;

/**
 * @memberOf Jymfony.Component.Testing.Framework.Exception
 */
export default class SyntheticSkippedException extends mix(SyntheticException, SkipException) {
}
