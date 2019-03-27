declare namespace Jymfony.Component.DependencyInjection.Argument {
    export class ArgumentInterface implements MixinInterface {
        public static readonly definition: Newable<ArgumentInterface>;

        public values: any[];
    }
}
