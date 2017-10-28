w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == 80) {
        W.togglePause();
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
