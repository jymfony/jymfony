global.dump = function dump(variable, ...moreVars) {
    Jymfony.Component.VarDumper.VarDumper.dump(variable);

    for (const v of moreVars) {
        Jymfony.Component.VarDumper.VarDumper.dump(v);
    }

    if (0 < moreVars.length) {
        return [ variable, ...moreVars ];
    }

    return variable;
};

global.dd = function dd(...vars) {
    for (const v of vars) {
        Jymfony.Component.VarDumper.VarDumper.dump(v);
    }

    process.exit(1);
};
