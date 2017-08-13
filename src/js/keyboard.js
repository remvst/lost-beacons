w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;
};
onkeyup = e => {
    console.log('lul');
    w.down[e.keyCode] = false;
};
