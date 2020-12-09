const ExceptionInterface = Jymfony.Contracts.HttpClient.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Contracts.HttpClient.Exception
 */
export default class DecodingException extends mix(global.RuntimeException, ExceptionInterface) {
}
