const Matcher = Jymfony.Component.Routing.Matcher.Matcher;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Routing
 */
export default class RedirectableMatcher extends Matcher {
    /**
     * @inheritdoc
     */
    redirect(request, path, route, scheme = null) {
        const isSecure = request.isSecure;
        return {
            _controller: 'Jymfony.Bundle.FrameworkBundle.Controller.RedirectController:urlRedirectAction',
            path: path,
            permanent: true,
            scheme: scheme,
            httpPort: isSecure ? 80 : (request.port || 80),
            httpsPort: isSecure ? (request.port || 443) : 443,
            _route: route,
        };
    }
}
