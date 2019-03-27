declare namespace Jymfony.Bundle.FrameworkBundle.Routing {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Matcher = Jymfony.Component.Routing.Matcher.Matcher;

    class RedirectableMatcher extends Matcher {
        /**
         * @inheritdoc
         */
        redirect(request: Request, path: string, route: string, scheme?: string | null): Record<string, any>;
    }
}
