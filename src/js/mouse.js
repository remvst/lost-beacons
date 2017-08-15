function eventCoords(e) {
    let r = C.getBoundingClientRect();
    return {
        'x': CANVAS_WIDTH * (e.pageX - r.left) / r.width + V.x,
        'y': CANVAS_HEIGHT * (e.pageY - r.top) / r.height + V.y
    };
}

onmousedown = e => {
    const c = eventCoords(e);
    G.selection = {
        'x': c.x,
        'y': c.y
    };
};

onmousemove = e => {
    const c = eventCoords(e);
    if (G.selection) {
        G.selection.width = c.x - G.selection.x;
        G.selection.height = c.y - G.selection.y;
    } else {
        G.mouseOver(c);
    }
};

onmouseup = () => {
    if (G.selection) {
        G.select(G.selection);
    }
    G.selection = null;
};
