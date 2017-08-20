function cache(w, h, f) {
    var c = D.createElement('canvas');
    c.width = w;
    c.height = h;

    // Either return what the function returns or the canvas by default
    return f(c.getContext('2d'), c) || c;
}
