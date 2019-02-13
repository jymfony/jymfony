declare namespace Jymfony.Component.Security.Authorization {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    export class AuthorizationCheckerInterface implements MixinInterface {
        /**
         * Checks if the attributes are granted against the given authentication token and optionally supplied subject.
         */
        isGranted(token: TokenInterface, attributes: any, subject?: any): boolean;
    }
}
