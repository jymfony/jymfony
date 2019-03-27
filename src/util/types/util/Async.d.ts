declare namespace __jymfony {
    export class Async {
        /**
         * Run an async generator.
         * Using this function you can use a generator to wait a promise
         * to be completed simply yield-ing it.
         * This function always returns a Promise object.
         */
        static run(generator: Invokable|Generator|GeneratorFunction|Function, ...args: any[]): Promise<any>;
    }
}
