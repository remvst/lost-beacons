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
    // G.selection = {
    //     'x': MOUSE_POSITION.x + V.x,
    //     'y': MOUSE_POSITION.y + V.y
    // };

    G.cursor.down({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};

onmousemove = e => {
    MOUSE_POSITION = eventCoords(e);
    // if (G.selection) {
    //     G.selection.width = MOUSE_POSITION.x + V.x - G.selection.x;
    //     G.selection.height = MOUSE_POSITION.y + V.y - G.selection.y;
    // }

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

    // if (G.selection) {
    //     G.select(G.selection);
    // }
    // G.selection = null;
};
