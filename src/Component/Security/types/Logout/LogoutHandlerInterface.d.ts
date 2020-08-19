declare namespace Jymfony.Component.Security.Logout {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class LogoutHandlerInterface {
        public static readonly definition: Newable<LogoutHandlerInterface>;

        /**
         * Performs a logout.
         */
        logout(request: Request, response: Response): Promise<void>;
    }
}
