declare namespace Jymfony.Component.Testing.Framework.Exception {
    import SkipException = Jymfony.Component.Testing.Framework.Exception.SkipException;
    import SyntheticException = Jymfony.Component.Testing.Framework.Exception.SyntheticException;

    export class SyntheticSkippedException extends mix(SyntheticException, SkipException) {
    }
}
