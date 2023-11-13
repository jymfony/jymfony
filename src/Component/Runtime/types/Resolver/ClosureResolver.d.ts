declare namespace Jymfony.Component.Runtime.Resolver {
    import ResolverInterface = Jymfony.Component.Runtime.ResolverInterface;

    export class ClosureResolver extends implementationOf(ResolverInterface) {
        #closure;
        #arguments;

        constructor(closure: Function, args: any[]);
        __construct(closure: Function, args: any[]): void;

        resolve(): [Function, any[]];
    }
}
