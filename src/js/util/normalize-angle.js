function normalizeAngle(a) {
    while (a < -PI) a += PI * 2;
    while (a > PI) a -= PI * 2;
    return a;
}
