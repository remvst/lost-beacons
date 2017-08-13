class Camera {

    constructor() {
        V = this;

        this.x = 0;
        this.y = 0;
    }

    cycle(e) {
        // TODO
        const p = {'x': 0, 'y': 0};

        if (w.down[37]) {
            p.x = -1;
        }
        if (w.down[39]) {
            p.x = 1;
        }
        if (w.down[38]) {
            p.y = -1;
        }
        if (w.down[40]) {
            p.y = 1;
        }

        if (p.x || p.y) {
            const angle = Math.atan2(p.y, p.x);
            this.x += Math.cos(angle) * CAMERA_SPEED * e;
            this.y += Math.sin(angle) * CAMERA_SPEED * e;
        }
    }

    get center() {
        return {
            'x': V.x + CANVAS_WIDTH / 2,
            'y': V.y + CANVAS_HEIGHT / 2
        };
    }

}
