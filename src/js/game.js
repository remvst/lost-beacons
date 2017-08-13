class Game {

    constructor() {
        G = this;

        new World();
        new Camera();

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

}
