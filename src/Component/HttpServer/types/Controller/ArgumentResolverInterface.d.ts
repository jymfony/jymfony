declare namespace Jymfony.Component.HttpServer.Controller {
    import Request = Jymfony.Component.HttpFoundation.Request;

    /**
     * An ArgumentResolverInterface instance knows how to determine the
     * arguments for a specific action.
     */
    export class ArgumentResolverInterface {
        public static readonly definition: Newable<ArgumentResolverInterface>;

        /**
         * Returns the arguments to pass to the controller.
         *
         * @returns An array of arguments to pass to the controller
         *
         * @throws {RuntimeException} When no value could be provided for a required argument
         */
        getArguments(request: Request, controller: Invokable<any>): any[] | Promise<any[]>;
    }
}
