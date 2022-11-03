declare namespace Jymfony.Component.Testing.Annotation {
    interface AfterEachInterface {
        (): <T>(value: T, context: any) => T;
        new(): AfterEachImpl;
    }

    class AfterEachImpl {
        /**
         * Constructor.
         */
        __construct(): void;
        constructor();
    }

    export var AfterEach: AfterEachInterface & AfterEachImpl;
}
