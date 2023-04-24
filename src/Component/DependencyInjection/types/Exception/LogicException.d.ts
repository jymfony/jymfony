declare namespace Jymfony.Component.DependencyInjection.Exception {
    import ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

    export class LogicException extends mix(global.LogicException, ExceptionInterface) {
    }
}
