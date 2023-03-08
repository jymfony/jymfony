declare namespace Jymfony.Component.DependencyInjection.Exception {
    import ExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.ExceptionInterface;

    export class InvalidArgumentException extends mix(global.InvalidArgumentException, ExceptionInterface) {
    }
}
