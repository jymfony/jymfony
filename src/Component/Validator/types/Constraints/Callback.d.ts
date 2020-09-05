declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;

    type TCallback = ((...args: any[]) => void | Promise<void>) | [ object, string ];
    export class Callback extends Constraint {
        callback: ((...args: any[]) => void | Promise<void>) | [ object, string ];

        /**
         * @inheritdoc
         */
        __construct(options?: null | ConstraintOptions<Callback>): this;
        constructor(options?: null | ConstraintOptions<Callback>);

        /**
         * @inheritdoc
         */
        public readonly defaultOption: string;

        /**
         * @inheritdoc
         */
        public readonly targets: string[];
    }
}
