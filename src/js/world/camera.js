class Camera {

    constructor() {
        V = this;

        this.x = 0;
        this.y = 0;
    }

    cycle(e) {
        // TODO
    }

    get center() {
        return {
            'x': V.x + CANVAS_WIDTH / 2,
            'y': V.y + CANVAS_HEIGHT / 2
        };
    }

}
