const ExceptionInterface = Jymfony.Contracts.HttpClient.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.HttpClient.Exception
 */
export default class TransportException extends mix(globalThis.RuntimeException, ExceptionInterface) {
}
