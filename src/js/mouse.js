let MOUSE_POSITION = {
    'x': 0,
    'y': 0
};

function eventCoords(e) {
    let r = C.getBoundingClientRect();
    return {
        'x': CANVAS_WIDTH * (e.pageX - r.left) / r.width,
        'y': CANVAS_HEIGHT * (e.pageY - r.top) / r.height
    };
}

onmousedown = e => {
    MOUSE_POSITION = eventCoords(e);

    G.cursor.down({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};

onmousemove = e => {
    MOUSE_POSITION = eventCoords(e);

    G.cursor.move({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};

onmouseup = () => {
    G.cursor.up({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};
