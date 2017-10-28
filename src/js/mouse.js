let MOUSE_POSITION = {
    'x': 0,
    'y': 0
};

let draggingMinimap = false;
let mouseInWindow = true;

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

    if (isBetween(0, xOnMap, 1) && isBetween(0, yOnMap, 1)) {
        V.x = (xOnMap * W.width) - CANVAS_WIDTH / 2;
        V.y = (yOnMap * W.height) - CANVAS_HEIGHT / 2;
    }
}

onmousedown = e => {
    mouseInWindow = true;
    MOUSE_POSITION = eventCoords(e);

    // Assuming the minimap is a square
    const xOnMap = (MOUSE_POSITION.x - (CANVAS_WIDTH - G.minimapWidth - MINIMAP_MARGIN)) / G.minimapWidth;
    const yOnMap = (MOUSE_POSITION.y - (CANVAS_HEIGHT - G.minimapHeight - MINIMAP_MARGIN)) / G.minimapHeight;

    if (xOnMap > 0 && xOnMap < 1 && yOnMap > 0 && yOnMap < 1) {
        draggingMinimap = true;
        followMinimap();
        return;
    }

    const position = {
        'x': MOUSE_POSITION.x + V.x,
        'y': MOUSE_POSITION.y + V.y
    };

    if (!W.beacons.filter(b => b.maybeClick(position)).length) {
        G.cursor[e.which == 3 ? 'rightDown' : 'down'](position);
    }

};

onmousemove = e => {
    mouseInWindow = true;
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
    mouseInWindow = true;
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

onmouseout = onblur = () => {
    mouseInWindow = false;
};
