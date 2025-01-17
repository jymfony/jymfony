declare namespace Jymfony.Bundle.FrameworkBundle.Controller {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import ResponseInterface = Jymfony.Contracts.HttpFoundation.ResponseInterface;
    import File = Jymfony.Component.HttpFoundation.File.File;

    /**
     * Common features needed in controllers.
     *
     * @internal
     * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
     */
    export class ControllerTrait {
        public static readonly definition: Newable<ControllerTrait>;

        /**
         * Returns true if the service id is defined.
         *
         * @final
         */
        protected has(id: string): boolean;

        /**
         * Gets a container service by its id.
         *
         * @final
         */
        protected get(id: string): object;

        /**
         * Generates a URL from the given parameters.
         *
         * @final
         */
        protected generateUrl(request: RequestInterface, route: string, parameters?: Record<string, any>, referenceType?: number): string;

        /**
         * Forwards the request to another controller.
         *
         * @final
         */
        protected forward(request: RequestInterface, controller: string, url?: string): Promise<ResponseInterface>;

        /**
         * Returns a RedirectResponse to the given URL.
         *
         * @returns {Jymfony.Component.HttpFoundation.RedirectResponse}
         *
         * @final
         */
        protected redirect(url: string, status?: number): ResponseInterface;

        /**
         * Returns a RedirectResponse to the given route with the given parameters.
         *
         * @returns {Jymfony.Component.HttpFoundation.RedirectResponse}
         *
         * @final
         */
        protected redirectToRoute(request: RequestInterface, route: string, parameters?: Record<string, any>, status?: number): ResponseInterface;

        /**
         * Returns a JsonResponse that uses the serializer component if enabled, or json_encode.
         *
         * @final
         */
        protected json(data: any, status?: number, headers?: Record<string, string>): ResponseInterface;

        /**
         * Returns a BinaryFileResponse object with original or customized file name and disposition header.
         *
         * @param file File object or path to file to be sent as response
         * @param fileName The filename to be sent to the client.
         * @param disposition Disposition inline or attachment.
         *
         * @final
         */
        protected file(file: File | string, fileName?: string | null, disposition?: 'attachment' | 'inline'): ResponseInterface;

        /**
         * Checks if the attributes are granted against the current authentication token and optionally supplied subject.
         *
         * @throws {LogicException}
         * @final
         */
        protected isGranted(request: RequestInterface, attributes: any, subject?: any): boolean;

        /**
         * Throws an exception unless the attributes are granted against the current authentication token and optionally
         * supplied subject.
         *
         * @throws {Jymfony.Component.Security.Exception.AccessDeniedException}
         * @final
         */
        protected denyAccessUnlessGranted(request: RequestInterface, attributes: any, subject?: any, message?: string): void;

        /**
         * Returns a rendered view.
         *
         * @final
         */
        protected renderView(view: string | object, parameters?: Record<string, any>): Promise<string>;

        /**
         * Renders a view.
         *
         * @final
         */
        protected render(view: string | object, parameters?: Record<string, any>, response?: ResponseInterface): ResponseInterface;

        /**
         * Returns a NotFoundHttpException.
         *
         * This will result in a 404 response code. Usage example:
         *
         *     throw this.createNotFoundException('Page not found!');
         *
         * @final
         */
        protected createNotFoundException(message?: string, previous?: Error | null): Error;

        /**
         * Returns an AccessDeniedException.
         *
         * This will result in a 403 response code. Usage example:
         *
         *     throw this.createAccessDeniedException('Unable to access this page!');
         *
         * @throws {LogicException} If the Security component is not available
         *
         * @final
         */
        protected createAccessDeniedException(message?: string, previous?: Error | null): Error;

        /**
         * Get a user from the Security Token Storage.
         *
         * @throws {LogicException} If SecurityBundle is not available
         *
         * @see Jymfony.Component.Security.Authentication.Token.TokenInterface.user
         *
         * @final
         */
        protected getUser(request: RequestInterface): object | null;
    }
}
