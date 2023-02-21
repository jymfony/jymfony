declare namespace Jymfony.Component.Messenger.Stamp {
    /**
     * @final
     */
    export class ValidationStamp extends implementationOf(StampInterface) {
        private _groups: string[] | Record<string, string> | any;

        /**
         * Constructor.
         */
        __construct(groups: string[] | Record<string, string> | any): void;
        constructor(groups: string[] | Record<string, string> | any);

        public readonly groups: string[] | Record<string, string> | any;
    }
}
