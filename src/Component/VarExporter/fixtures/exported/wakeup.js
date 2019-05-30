(() => {
    let o;
    return Jymfony.Component.VarExporter.Internal.Hydrator.hydrate(
        o = [
            (new ReflectionClass("Jymfony.Component.VarExporter.Fixtures.MyWakeup")).newInstanceWithoutConstructor(),
            (new ReflectionClass("Jymfony.Component.VarExporter.Fixtures.MyWakeup")).newInstanceWithoutConstructor()
        ],
        null,
        {
            "Jymfony.Component.VarExporter.Fixtures.MyWakeup": {
                ["sub"]: {
                    ["0"]: o[1],
                    ["1"]: 123,
                },
                ["baz"]: {
                    ["1"]: 123,
                },
            },
        },
        o[0],
        [
            1,
            0,
        ]
    );
})();
