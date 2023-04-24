declare namespace Jymfony.Component.Testing.Annotation {
    interface BeforeEachInterface {
        (): <T>(value: T, context: any) => T;
        new(): BeforeEachImpl;
    }

    class BeforeEachImpl {
        /**
         * Constructor.
         */
        __construct(): void;
        constructor();
    }

    export var BeforeEach: BeforeEachInterface & BeforeEachImpl;
}
