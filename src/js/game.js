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
        // TODO cycle things
        V.cycle(e);

        // V.x += e * 100;
        // V.y += e * 150;

        W.render();
    }

}
