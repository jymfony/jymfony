declare namespace Jymfony.Component.Logger.Handler {
    export class ProcessableHandlerInterface {
        public static readonly definition: Newable<ProcessableHandlerInterface>;

        /**
         * Adds a processor in the stack.
         */
        pushProcessor(processor: InvokableProcessor): this;

        /**
         * Removes the processor on top of the stack and returns it.
         *
         * @throws {Jymfony.Component.Logger.Exception.LogicException} In case the processor stack is empty
         */
        popProcessor(): InvokableProcessor;
    }
}
