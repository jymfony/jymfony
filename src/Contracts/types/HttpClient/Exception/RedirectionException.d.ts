declare namespace Jymfony.Contracts.HttpClient.Exception {
    import RuntimeException = Jymfony.Contracts.HttpClient.Exception.RuntimeException;

    /**
     * Represents a 3xx response.
     *
     * @final
     */
    export class RedirectionException extends RuntimeException {
    }
}
