declare namespace Jymfony.Component.Crontab.Compiler {
    import ConstraintInterface = Jymfony.Component.Crontab.Constraints.ConstraintInterface;
    import PeriodInterface = Jymfony.Component.Crontab.Constraints.PeriodInterface;

    export class Compiler {
        static compile(scheduleDefinitions: Schedule[]): CompiledSchedule;

        /**
         * Creates a constraint from its position name.
         */
        static constraintFactory(name: ConstraintType): ConstraintInterface & PeriodInterface;
    }
}
