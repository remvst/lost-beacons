let MOUSE_POSITION = {
    'x': 0,
    'y': 0
};

let draggingMinimap = false;

function eventCoords(e) {
    let r = C.getBoundingClientRect();
    return {
        'x': CANVAS_WIDTH * (e.pageX - r.left) / r.width,
        'y': CANVAS_HEIGHT * (e.pageY - r.top) / r.height
    };
}

function followMinimap() {
    const xOnMap = (MOUSE_POSITION.x - (CANVAS_WIDTH - G.minimapWidth - MINIMAP_MARGIN)) / G.minimapWidth;
    const yOnMap = (MOUSE_POSITION.y - (CANVAS_HEIGHT - G.minimapHeight - MINIMAP_MARGIN)) / G.minimapHeight;

    if (xOnMap > 0 && xOnMap < 1 && yOnMap > 0 && yOnMap < 1) {
        // interp(V, 'x', V.x, (xOnMap * W.width) - CANVAS_WIDTH / 2, 0.1);
        // interp(V, 'y', V.y, (yOnMap * W.height) - CANVAS_HEIGHT / 2, 0.1);
        V.x = (xOnMap * W.width) - CANVAS_WIDTH / 2;
        V.y = (yOnMap * W.height) - CANVAS_HEIGHT / 2;
    }
}

onmousedown = e => {
    MOUSE_POSITION = eventCoords(e);

    // Assuming the minimap is a square
    const xOnMap = (MOUSE_POSITION.x - (CANVAS_WIDTH - G.minimapWidth - MINIMAP_MARGIN)) / G.minimapWidth;
    const yOnMap = (MOUSE_POSITION.y - (CANVAS_HEIGHT - G.minimapHeight - MINIMAP_MARGIN)) / G.minimapHeight;

    if (xOnMap > 0 && xOnMap < 1 && yOnMap > 0 && yOnMap < 1) {
        draggingMinimap = true;
        followMinimap();
        return;
    }

    G.cursor[e.which == 3 ? 'rightDown' : 'down']({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};

onmousemove = e => {
    MOUSE_POSITION = eventCoords(e);

    if (draggingMinimap) {
        followMinimap();
        return;
    }

    G.cursor.move({
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    });
};

onmouseup = () => {
    draggingMinimap = false;
    if (G.cursor.downPosition) {
        G.cursor.up({
            'x': MOUSE_POSITION.x + V.x,
            'y': MOUSE_POSITION.y + V.y
        });
    }
};

oncontextmenu = e => {
    e.preventDefault();
};
