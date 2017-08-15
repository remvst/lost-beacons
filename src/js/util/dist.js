// Distance between points a and b
function dist(a, b) {
    return distP(a.x, a.y, b.x, b.y);
}

// Distance between (x1, y1) and (x2, y2)
function distP(x1, y1, x2, y2) {
    return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}
