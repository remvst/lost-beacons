function rise(segment, color, renderCondition) {
    return new Polygon([
        {'x': segment[0].x, 'y': segment[0].y, 'z': 0},
        {'x': segment[1].x, 'y': segment[1].y, 'z': 0},
        {'x': segment[1].x, 'y': segment[1].y, 'z': 100},
        {'x': segment[0].x, 'y': segment[0].y, 'z': 100}
    ], color, renderCondition);
}

function cube(x, y, w, h, color) {
    return [
        // Roof
        new Polygon([
            {'x': x, 'y': y, 'z': 100},
            {'x': x, 'y': y + h, 'z': 100},
            {'x': x + w, 'y': y + h, 'z': 100},
            {'x': x + w, 'y': y, 'z': 100}
        ], '#146', function() {
            return true;
        }),

        // Top side
        rise([
            {'x': x, 'y': y},
            {'x': x + w, 'y': y}
        ], color, function(c) {
            return c.y < y;
        }),

        // Bottom side
        rise([
            {'x': x, 'y': y + h},
            {'x': x + w, 'y': y + h}
        ], color, function(c) {
            return c.y > y + h;
        }),

        // Left side
        rise([
            {'x': x, 'y': y},
            {'x': x, 'y': y + h}
        ], color, function(c) {
            return c.x < x;
        }),

        // Right side
        rise([
            {'x': x + w, 'y': y},
            {'x': x + w, 'y': y + h}
        ], color, function(c) {
            return c.x > x + w;
        }),
    ];
}
