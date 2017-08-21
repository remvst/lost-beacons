function zeroes(x) {
    x = '' + x;
    while (x.length < 2) {
        x = '0' + x;
    }
    return x;
}

function formatTime(t) {
    t = ~~t;

    return zeroes(~~(t / 60)) + ':' + zeroes(t % 60);
}
