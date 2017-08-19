function diamond(map, startRow, endRow, startCol, endCol, maxRand) {

    const topLeft = map[startRow][startCol];
    const topRight = map[startRow][endCol];
    const bottomLeft = map[endRow][startCol];
    const bottomRight = map[endRow][endCol];

    const avg = (topLeft + topRight + bottomLeft + bottomRight) / 4;

    // console.log('square step:' + avg);

    map[startRow + (endRow - startRow) / 2][startCol + (endCol - startCol) / 2] = avg + Math.random() * maxRand;

    if (startRow == endRow - 1) {
        return;
    }

    maxRand *= 0.5;

    square(map, startRow, endRow, startCol, endCol, maxRand);
}

function square(map, startRow, endRow, startCol, endCol, maxRand) {
    if (startRow == endRow - 1) {
        return;
    }

    const midRow = startRow + (endRow - startRow) / 2;
    const midCol = startCol + (endCol - startCol) / 2;

    // console.log(startRow, endRow, startCol, endCol, midRow, midCol);

    const middleAvg = map[midRow][midCol];

    // Left
    map[midRow][startCol] = middleAvg / 4 + Math.random();

    // Right
    map[midRow][endCol] = middleAvg / 4 + Math.random();

    // Top
    map[startRow][midCol] = middleAvg / 4 + Math.random();

    // Bottom
    map[endRow][midCol] = middleAvg / 4 + Math.random();

    square(map, startRow, midRow, startCol, midCol, maxRand);
    square(map, midRow, endRow, startCol, midCol, maxRand);

    square(map, startRow, midRow, midCol, endCol, maxRand);
    square(map, midRow, endRow, midCol, endCol, maxRand);
}

function roundP(x, p = 1) {
    return Math.round(x / p) * p;
}


function ds() {
    const size = 65;
    const map = [];

    for (let row = 0 ; row < size ; row++) {
        map.push([]);
        for (let col = 0 ; col < size ; col++) {
            map[row][col] = 0;
        }
    }

    map[0][0] = Math.random();
    map[size - 1][0] = Math.random();
    map[0][size - 1] = Math.random();
    map[size - 1][size - 1] = Math.random();

    diamond(map, 0, size - 1, 0, size - 1, 10);

    const max = map.reduce((max, row) => {
        return row.reduce((max, x) => {
            return Math.max(max, x);
        }, max);
    }, 0);

    const threshold = max / 2;

    // console.log(map.map(row => row.map(x => x.toPrecision(1)).join(' , ')).join('\n'));

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, size, size);

    for (let row = 0 ; row < size ; row++) {
        for (let col = 0 ; col < size ; col++) {
            const index = (row * size + col) * 4;
            const value = map[row][col] * 255 / max;
            // value = map[row][col] > threshold ? 0 : 255;
            imageData.data[index] = value; // red
            imageData.data[index + 1] = value; // green
            imageData.data[index + 2] = value; // blue
            imageData.data[index + 3] = 255; // alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);

    document.body.appendChild(canvas);

    return map.map(row => {
        return row.map(x => x > threshold);
    });
}

function ds2() {
    const size = 4;

    var myInitMap = [
        4,1,2,4,
        1,4,2,2,
        3,2,1,6,
        2,1,1,5
    ];

    // Create a new DiamondSquare algorithm from the initial map, with a random
    // roughness factor
    var ds = new DiamondSquare(myInitMap, size, size, Math.random() * 10);

    // Iterate until you're satisfied. The map doubles in size with each
    // iteration.
    ds.iterate();
    ds.iterate();

    // Then the data you want is in:
    console.log(ds.dataStore);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, size, size);

    const max = ds.max();
    const min = ds.min();

    ds.dataStore.forEach((x, index) => {
        const value = (x - min) / (max - min) * 255;

        imageData.data[index * 4] = value;
        imageData.data[index * 4 + 1] = value;
        imageData.data[index * 4 + 2] = value;
        imageData.data[index * 4 + 3] = 255;
    });

    ctx.putImageData(imageData, 0, 0);

    document.body.appendChild(canvas);
}
