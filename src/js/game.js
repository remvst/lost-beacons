class Game {

    constructor() {
        G = this;

        G.t = 0;

        new World();
        new Camera();

        G.selectedUnits = [];

        // Start cycle()
        let lf = Date.now();
        let frame = () => {
            let n = Date.now(),
                e = (n - lf) / 1000;

            if(DEBUG){
                G.fps = ~~(1 / e);
            }

            lf = n;

            G.cycle(e);

            requestAnimationFrame(frame);
        };
        frame();
    }

    cycle(e) {
        G.t += e;

        // Game loop things
        W.elements.forEach(x => x.cycle(e));
        V.cycle(e);

        // Render things
        W.render();
    }

    select(s) {
        if (Math.abs(s.width || 0) < 5 && Math.abs(s.height || 0) < 5) {
            const usedPositions = [];
            G.selectedUnits.forEach(unit => {
                const target = W.firstFreePositionsAround(s, usedPositions)
                    .sort((a, b) => dist(a, unit) - dist(b, unit))[0];

                if (target) {
                    usedPositions.push(target);
                    unit.goto(target);
                } else {
                    console.log('wtg');
                }
            });
            return;
        }

        G.selectedUnits = W.elements.filter(e => {
            return isBetween(s.x, e.x, s.x + s.width) && isBetween(s.y, e.y, s.y + s.height);
        });
    }

}
