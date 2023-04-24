declare namespace Jymfony.Component.DependencyInjection.Exception {
    import ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

    export class BadMethodCallException extends mix(global.BadMethodCallException, ExceptionInterface) {
    }
}
