const Caster = Jymfony.Component.VarDumper.Caster;

const casters = [
    [ Jymfony.Component.VarDumper.Cloner.Stub, Caster.StubCaster.castStub ],
    [ Caster.ConstStub, Caster.StubCaster.castStub ],

    [ Date, Caster.DateCaster.castDate ],

    [ Error, Caster.ErrorCaster.castError ],
    [ Caster.TraceStub, Caster.ErrorCaster.castTraceStub ],
    [ Caster.FrameStub, Caster.ErrorCaster.castFrameStub ],
];

if (ReflectionClass.exists('Jymfony.Component.DateTime.DateTime')) {
    casters.push([ Jymfony.Component.DateTime.DateTime, Caster.DateCaster.castDateTime ]);
    casters.push([ Jymfony.Component.DateTime.DateTimeZone, Caster.DateCaster.castDateTimeZone ]);
}

module.exports = casters;
