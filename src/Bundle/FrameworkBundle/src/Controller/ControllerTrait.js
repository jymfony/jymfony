/**
 * Common features needed in controllers.
 *
 * @internal
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
class ControllerTrait {
    /**
     * Returns true if the service id is defined.
     *
     * @param {string} id
     *
     * @returns {boolean}
     *
     * @final
     * @protected
     */
    has(id) {
        return this._container.has(id);
    }

    /**
     * Gets a container service by its id.
     *
     * @param {string} id
     *
     * @returns {object} The service
     *
     * @final
     * @protected
     */
    get(id) {
        return this._container.get(id);
    }

    /**
     * Generates a URL from the given parameters.
     *
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     * @param {string} route
     * @param {Object.<string, *>} parameters
     * @param {int} referenceType
     *
     * @returns {string}
     *
     * @see UrlGeneratorInterface
     *
     * @final
     * @protected
     */
    generateUrl(request, route, parameters = {}, referenceType = undefined) {
        if (undefined === referenceType && ReflectionClass.exists('Jymfony.Component.Routing.Generator.UrlGeneratorInterface')) {
            referenceType = Jymfony.Component.Routing.Generator.UrlGeneratorInterface.ABSOLUTE_PATH;
        }

        let router = this._container.get('router');
        if (!! request) {
            router = router.withContext(request);
        }

        return router.generate(route, parameters, referenceType);
    }

    /**
     * Forwards the request to another controller.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request The original request.
     * @param {string} controller The controller name.
     * @param {string} url
     *
     * @returns {Promise<Jymfony.Contracts.HttpFoundation.ResponseInterface>}
     *
     * @final
     * @protected
     */
    forward(request, controller, url = request.uri) {
        const subRequest = request.duplicate(url);
        subRequest.attributes.set('_controller', controller);

        return request.attributes.get('_handler').handle(subRequest);
    }

    /**
     * Returns a RedirectResponse to the given URL.
     *
     * @param {string} url
     * @param {int} status
     *
     * @returns {Jymfony.Component.HttpFoundation.RedirectResponse}
     *
     * @final
     * @protected
     */
    redirect(url, status = 302) {
        return new Jymfony.Component.HttpFoundation.RedirectResponse(url, status);
    }

    /**
     * Returns a RedirectResponse to the given route with the given parameters.
     *
     * @final
     * @protected
     */
    redirectToRoute(request, route, parameters = {}, status = 302) {
        return this.redirect(this.generateUrl(request, route, parameters), status);
    }

    /**
     * Returns a JsonResponse that uses the serializer component if enabled, or json_encode.
     *
     * @param {*} data
     * @param {int} status
     * @param {Object.<string, string>} headers
     *
     * @returns {Jymfony.Component.HttpFoundation.JsonResponse}
     *
     * @final
     * @protected
     */
    json(data, status = 200, headers = {}) {
        return new Jymfony.Component.HttpFoundation.JsonResponse(data, status, headers);
    }

    /**
     * Returns a BinaryFileResponse object with original or customized file name and disposition header.
     *
     * @param {Jymfony.Component.HttpFoundation.File.File|string} file File object or path to file to be sent as response
     * @param {string|null} fileName The filename to be sent to the client.
     * @param {string} disposition Disposition inline or attachment.
     *
     * @returns {Jymfony.Component.HttpFoundation.BinaryFileResponse}
     *
     * @final
     * @protected
     */
    file(file, fileName = null, disposition = Jymfony.Component.HttpFoundation.ResponseHeaderBag.DISPOSITION_ATTACHMENT) {
        const response = new Jymfony.Component.HttpFoundation.BinaryFileResponse(file);
        response.setContentDisposition(disposition, fileName || response._file.fileName);

        return response;
    }

    /**
     * Checks if the attributes are granted against the current authentication token and optionally supplied subject.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {*} attributes
     * @param {*} [subject]
     *
     * @returns {boolean}
     *
     * @throws {LogicException}
     *
     * @final
     * @protected
     */
    isGranted(request, attributes, subject = null) {
        if (! this._container.has('security.authorization_checker')) {
            throw new LogicException('The SecurityBundle is not registered in your application. Try running "yarn add @jymfony/security-bundle".');
        }

        const token = this._container
            .get('Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface')
            .getToken(request);

        return this._container.get('security.authorization_checker').isGranted(token, attributes, subject);
    }

    /**
     * Throws an exception unless the attributes are granted against the current authentication token and optionally
     * supplied subject.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {*} attributes
     * @param {*} subject
     * @param {string} message
     *
     * @throws {Jymfony.Component.Security.Exception.AccessDeniedException}
     *
     * @final
     * @protected
     */
    denyAccessUnlessGranted(request, attributes, subject = null, message = 'Access Denied.') {
        if (! this.isGranted(request, attributes, subject)) {
            const exception = this.createAccessDeniedException(message);
            exception.attributes = attributes;
            exception.subject = subject;

            throw exception;
        }
    }

    /**
     * Returns a rendered view.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} view
     * @param {*} parameters
     *
     * @returns {Promise<string>}
     *
     * @final
     * @protected
     */
    async renderView(view, parameters = {}) {
        if (! this._container.has('templating')) {
            throw new LogicException('You can not use the "renderView" method if the Templating Component is not available. Try running "yarn add @jymfony/templating".');
        }

        const buffer = new __jymfony.StreamBuffer();
        await this._container.get('templating').render(buffer, view, parameters);

        return buffer.buffer.toString('utf-8');
    }

    /**
     * Renders a view.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} view
     * @param {*} parameters
     * @param {Jymfony.Contracts.HttpFoundation.ResponseInterface | null} [response]
     *
     * @returns {Jymfony.Contracts.HttpFoundation.ResponseInterface}
     *
     * @final
     * @protected
     */
    render(view, parameters = {}, response = null) {
        if (! this._container.has('templating')) {
            throw new LogicException('You can not use the "render" method if the Templating Component is not available. Try running "yarn add @jymfony/templating".');
        }

        if (null === response) {
            response = new Jymfony.Component.HttpFoundation.Response();
        }

        const templating = this._container.get('templating');
        response.content = async (responseStream) => {
            await templating.render(responseStream, view, parameters);
        };

        return response;
    }

    /**
     * Returns a NotFoundHttpException.
     *
     * This will result in a 404 response code. Usage example:
     *
     *     throw this.createNotFoundException('Page not found!');
     *
     * @param {string} message
     * @param {Error} previous
     *
     * @returns {Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException}
     *
     * @final
     * @protected
     */
    createNotFoundException(message = 'Not Found', previous = null) {
        return new Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException(message, previous);
    }

    /**
     * Returns an AccessDeniedException.
     *
     * This will result in a 403 response code. Usage example:
     *
     *     throw this.createAccessDeniedException('Unable to access this page!');
     *
     * @param {string} message
     * @param {Error} previous
     *
     * @returns {Jymfony.Component.Security.Exception.AccessDeniedException}
     *
     * @throws {LogicException} If the Security component is not available
     *
     * @final
     */
    createAccessDeniedException(message = 'Access Denied.', previous = null) {
        if (! ReflectionClass.exists('Jymfony.Component.Security.Exception.AccessDeniedException')) {
            throw new LogicException('You can not use the "createAccessDeniedException" method if the Security component is not available. Try running "yarn add @jymfony/security-bundle".');
        }

        return new Jymfony.Component.Security.Exception.AccessDeniedException(message, previous);
    }

    /**
     * Get a user from the Security Token Storage.
     *
     * @returns {object|null}
     *
     * @throws {LogicException} If SecurityBundle is not available
     *
     * @see Jymfony.Component.Security.Authentication.Token.TokenInterface.user
     *
     * @final
     * @protected
     */
    getUser(request) {
        if (! this._container.has('Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface')) {
            throw new LogicException('The SecurityBundle is not registered in your application. Try running "yarn add @jymfony/security-bundle".');
        }

        const token = this._container
            .get(Jymfony.Component.Security.Authentication.Token.Storage.TokenStorageInterface)
            .getToken(request);
        if (! token) {
            return null;
        }

        const user = token.user;
        if (! isObject(user)) {
            // E.g. anonymous authentication
            return null;
        }

        return user;
    }
}

export default getTrait(ControllerTrait);
