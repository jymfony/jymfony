declare namespace Jymfony.Component.Testing.Promise {
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class PromiseInterface {
        public static readonly definition: Newable<PromiseInterface>;

        /**
         * Evaluates promise.
         */
        execute(args: any[], object: ObjectProphecy, method: MethodProphecy): any;
    }
}
