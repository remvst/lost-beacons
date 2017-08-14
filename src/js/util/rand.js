function rand(a, b) {
    // ~~b -> 0
    return Math.random() * ((a || 1) - ~~b) + ~~b;
}
