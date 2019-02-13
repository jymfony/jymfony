declare namespace Jymfony.Component.HttpFoundation.Negotiation {
    /**
     * @final
     */
    export class Match {
        public quality: number;
        public score: number;
        public index: number;

        /**
         * Constructor.
         */
        __construct(quality: number, score: number, index: number): void;
        constructor(quality: number, score: number, index: number);

        /**
         * Compares two matches instances.
         */
        static compare(a: Match, b: Match): 0 | 1 | -1;

        static reduce(carry: Record<number, Match>, match: Match): Record<number, Match>;
    }
}
