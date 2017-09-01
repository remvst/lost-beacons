function coat(map, width, x) {
    for (let i = 0 ; i < width ; i++) {
        const rowTop = [];
        const rowBottom = [];
        for (let k = 0 ; k < map[0].length ; k++) {
            rowTop.push(x);
            rowBottom.push(x);
        }
        map.unshift(rowTop);
        map.push(rowBottom);
    }

    map.forEach(row => {
        for (let i = 0 ; i < width ; i++) {
            row.push(x);
            row.unshift(x);
        }
    });

    return map;
}

function generate(rows, cols) {
    seedPerlin();

    const map = [];
    for (let row = 0 ; row < rows ; row++) {
        map.push([]);
        for (let col = 0 ; col < cols ; col++) {
            const x = pow(abs(perlin2(row / 5, col / 5)), 2);
            map[row][col] = ~~(x / 0.2);
        }
    }

    return coat(coat(map, GRID_EMPTY_PADDING, 0), GRID_OBSTACLE_PADDING, 1);
}
