// x: number to round
// p: precision
function roundP(x, p = 1) {
    return round(x / p) * p;
}

function floorP(x, p = 1) {
    return ~~(x / p) * p;
}
