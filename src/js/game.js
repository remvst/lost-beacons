class Game {

    constructor() {
        G = this;

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
        // Game loop things
        W.elements.forEach(x => x.cycle(e));
        V.cycle(e);

        // Render things
        W.render();
    }

    select(s) {
        if (!Math.abs(s.width) || !Math.abs(s.height)) {
            G.selectedUnits.forEach(unit => unit.goto(s));
        }

        G.selectedUnits = W.elements.filter(e => {
            return between(s.x, e.x, s.x + s.width) && between(s.y, e.y, s.y + s.height);
        });
    }

}
