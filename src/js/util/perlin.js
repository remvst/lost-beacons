/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

class Grad {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot2(x, y) {
        return this.x * x + this.y * y;
    }

}

const grad3 = [
    new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
    new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
    new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)
];

// To remove the need for index wrapping, double the permutation table length
const perm = new Array(512);
const gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed(seed) {
    const p = [];
    for (let i = 0 ; i < 256 ; i++) {
        p.push(~~(random() * 256));
    }

    p.forEach((v, i) => {
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    });
}

  // ##### Perlin noise stuff

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

// 2D Perlin Noise
function perlin2(x, y) {
    // Find unit grid cell containing point
    let X = floor(x), Y = floor(y);

    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Compute the fade curve value for x
    const u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(
            gradP[X + perm[Y]].dot2(x, y),
            gradP[X + 1 + perm[Y]].dot2(x - 1, y),
            u
        ),
        lerp(
            gradP[X + perm[Y + 1]].dot2(x, y - 1),
            gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1),
            u
        ),
        fade(y)
    );
}
