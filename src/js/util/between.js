function isBetween(a, b, c) {
    return a <= b && b <= c || a >= b && b >= c;
}

function between(a, b, c) {
    if (b < a) {
        return a;
    }
    if (b > c) {
        return c;
    }
    return b;
}
