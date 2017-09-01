function rise(segment, z, color, renderCondition) {
    return new Polygon([
        {'x': segment[0].x, 'y': segment[0].y, 'z': z},
        {'x': segment[1].x, 'y': segment[1].y, 'z': z},
        {'x': segment[1].x, 'y': segment[1].y, 'z': z + GRID_SIZE},
        {'x': segment[0].x, 'y': segment[0].y, 'z': z + GRID_SIZE}
    ], color, renderCondition);
}

function cube(x, y, w, h, z, color) {
    return [
        // Roof
        new Polygon([
            {'x': x, 'y': y, 'z': z + GRID_SIZE},
            {'x': x, 'y': y + h, 'z': z + GRID_SIZE},
            {'x': x + w, 'y': y + h, 'z': z + GRID_SIZE},
            {'x': x + w, 'y': y, 'z': z + GRID_SIZE}
        ], '#146', function() {
            return true;
        }),

        // Top side
        rise([
            {'x': x, 'y': y},
            {'x': x + w, 'y': y}
        ], z, color, function(c) {
            return c.y < y;
        }),

        // Bottom side
        rise([
            {'x': x, 'y': y + h},
            {'x': x + w, 'y': y + h}
        ], z, color, function(c) {
            return c.y > y + h;
        }),

        // Left side
        rise([
            {'x': x, 'y': y},
            {'x': x, 'y': y + h}
        ], z, color, function(c) {
            return c.x < x;
        }),

        // Right side
        rise([
            {'x': x + w, 'y': y},
            {'x': x + w, 'y': y + h}
        ], z, color, function(c) {
            return c.x > x + w;
        }),
    ];
}
