declare namespace Jymfony.Component.Testing.Framework.Exception {
    import Exception = Jymfony.Component.Testing.Framework.Exception.Exception;
    import SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;

    export class SkippedTestException extends mix(Exception, SkipException) {
    }
}
