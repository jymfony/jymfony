const Constraints = Jymfony.Component.Crontab.Constraints;
const CompiledSchedule = Jymfony.Component.Crontab.Compiler.CompiledSchedule;

/**
 * @memberOf Jymfony.Component.Crontab.Compiler
 */
export default class Compiler {
    static compile(scheduleDefinitions) {
        const constraints = [];

        for (const key of Object.keys(scheduleDefinitions)) {
            const values = 'd' === key ? scheduleDefinitions[key].map(v => 0 === v ? 7 : v).sort() : scheduleDefinitions[key];
            constraints.push({ constraint: __self.constraintFactory(key), values });
        }

        // Sort constraints based on their range for best performance (we want to
        // Always skip the largest block of time possible to find the next valid value)
        constraints.sort((a, b) => {
            const ra = a.constraint.range, rb = b.constraint.range;

            return (rb < ra) ? -1 : (rb > ra) ? 1 : 0;
        });

        return new CompiledSchedule(constraints);
    }

    /**
     * Creates a constraint from its position name.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Crontab.Constraints.ConstraintInterface & Jymfony.Component.Crontab.Constraints.PeriodInterface}
     */
    static constraintFactory(name) {
        switch (name) {
            case 'Y': return new Constraints.Year();
            case 'M': return new Constraints.Month();
            case 'D': return new Constraints.Day();
            case 'd': return new Constraints.DayOfWeek();
            case 'h': return new Constraints.Hour();
            case 'm': return new Constraints.Minute();
            case 's': return new Constraints.Second();
        }
    }
}
