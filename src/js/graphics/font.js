var defs = {
    nomangle(a): matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(b): matrix([
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,1,1]
    ]),
    nomangle(c): matrix([
        [1,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ]),
    nomangle(d): matrix([
        [1,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    nomangle(e): matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,1,1]
    ]),
    nomangle(f): matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,0,0]
    ]),
    nomangle(g): matrix([
        [1,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,1],
        [1,1,1]
    ]),
    nomangle(h): matrix([
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(i): matrix([
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ]),
    nomangle(j): [
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [1,0,1],
        [1,1,1]
    ],
    nomangle(k): matrix([
        [1,0,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(l): matrix([
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ]),
    nomangle(m): matrix([
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(n): matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(o): matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    nomangle(p): matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,0],
        [1,0,0]
    ]),
    nomangle(q): matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1]
    ]),
    nomangle(r): matrix([
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(s): matrix([
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    nomangle(t): matrix([
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ]),
    nomangle(u): matrix([
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    nomangle(v): matrix([
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
    ]),
    nomangle(w): matrix([
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [0,1,0,1,0]
    ]),
    nomangle(x): matrix([
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    nomangle(y): matrix([
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,1,0],
        [0,1,0]
    ]),
    /*'\'': matrix([
        [1]
    ]),*/
    '.': matrix([
        [0],
        [0],
        [0],
        [0],
        [1]
    ]),
    ' ': matrix([
        [0,0],
        [0,0],
        [0,0],
        [0,0],
        [0,0]
    ]),
    '-': [
        [0,0],
        [0,0],
        [1,1],
        [0,0],
        [0,0]
    ],
    ':': matrix([
        [0],
        [1],
        [ ],
        [1],
        [ ]
    ]),
    '?': matrix([
        [1,1,1],
        [1,1,1],
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ]),
    '!': matrix([
        [0,1,0,1,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,0,1,0,0]
    ]),
    '/': matrix([
        [0,0,1],
        [0,0,1],
        [0,1,0],
        [1,0,0],
        [1,0,0]
    ]),
    '1': matrix([
        [1,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ]),
    '2': matrix([
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ]),
    '3': matrix([
        [1,1,1],
        [0,0,1],
        [0,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    '4': matrix([
        [1,0,0],
        [1,0,0],
        [1,0,1],
        [1,1,1],
        [0,0,1]
    ]),
    '5': matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [0,0,1],
        [1,1,0]
    ]),
    '6': matrix([
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ]),
    '7': matrix([
        [1,1,1],
        [0,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ]),
    '8': matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ]),
    '9': matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    '0': matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    '(': matrix([
        [0,1],
        [1],
        [1],
        [1],
        [0,1]
    ]),
    ')': matrix([
        [1, 0],
        [0, 1],
        [0, 1],
        [0, 1],
        [1]
    ])
};

if(DEBUG){
    (function() {
        window.used = {};
        for(var i in defs){
            window.used[i] = false;
        }

        window.checkUsed = function(){
            var unused = [];
            for (let i in window.used) {
                if(!window.used[i]){
                    unused.push(i);
                }
            }
            return unused.sort();
        };
    })();
}

// r: context
// t: text
// x: x coord
// y: y coord
// s: cell size
// c: color
function drawText(r, t, x, y, s, c, sh) {
    if (sh) {
        drawText(r, t, x, y + s, s, '#000');
    }

    for(var i = 0 ; i < t.length ; i++){
        if (DEBUG) {
            window.used[t.charAt(i)] = true;
        }

        const cached = cachedCharacter(t.charAt(i), s, c);
        r.drawImage(cached, x, y);
        x += cached.width + s;
    }
}

function drawCenteredText(r, t, x, y, s, c, sh) {
    return drawText(r, t, x - s * requiredCells(t) / 2, y, s, c, sh);
}

// Returns the total cells required to draw the specified text
function requiredCells(t) {
    const r = 0;
    for(var i = 0 ; i < t.length ; i++){
        r += defs[t.charAt(i)][0].length + 1;
    }
    return r - 1;
}

const cachedChars = {};
function cachedCharacter(t, s, c){
    const key = t + s + c;
    const def = defs[t];
    cachedChars[key] = cachedChars[key] || cache(def[0].length * s, def.length * s, function(r) {
        r.fillStyle = c;
        def.forEach((y, row) => {
            y.forEach((x, col) => {
                if (x) {
                    r.fillRect(col * s, row * s, s, s);
                }
            });
        });
    });
    return cachedChars[key];
}
