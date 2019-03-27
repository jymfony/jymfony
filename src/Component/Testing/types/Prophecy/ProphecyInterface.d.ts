declare namespace Jymfony.Component.Testing.Prophecy {
    export class ProphecyInterface implements MixinInterface {
        public static readonly definition: Newable<ProphecyInterface>;

        /**
         * Reveal the current prophecy.
         */
        reveal(): any;
    }
}
