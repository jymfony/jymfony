declare namespace Jymfony.Component.Security.Authorization {
    import TokenInterface = Jymfony.Component.Security.Authentication.Token.TokenInterface;

    export class AuthorizationChecker extends implementationOf(AuthorizationCheckerInterface) {
        private _accessDecisionManager: AccessDecisionManagerInterface;

        /**
         * Constructor.
         */
        __construct(accessDecisionManager: AccessDecisionManagerInterface): void;
        constructor(accessDecisionManager: AccessDecisionManagerInterface);

        /**
         * @inheritdoc
         */
        isGranted(token: TokenInterface, attributes: any, subject?: any): boolean;
    }
}
