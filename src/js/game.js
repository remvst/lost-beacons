class Game {

    constructor() {
        G = this;

        // Start cycle()
        let lf = Date.now();
        let frame = () => {
                var n = Date.now(),
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

    }

}
