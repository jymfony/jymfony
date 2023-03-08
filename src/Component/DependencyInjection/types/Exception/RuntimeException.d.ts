declare namespace Jymfony.Component.DependencyInjection.Exception {
    import ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

    export class RuntimeException extends mix(global.RuntimeException, ExceptionInterface) {
    }
}
