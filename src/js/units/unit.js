class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.team = PLAYER_TEAM;

        this.path = [];

        this.angle = 0;
        this.moving = false;

        this.health = 1;
        this.hurtFactor = 1;

        this.setBehavior(new Idle());
    }

    get dead() {
        return !this.health;
    }

    hurt(amount) {
        this.health -= amount * this.hurtFactor;
        if (this.health < 0.1) {
            this.health = 0;
        }

        let particles = 1;

        if (this.dead) {
            W.remove(this);
            particles = 20;

            let k = 20;
            while (k--) {
                const d = rand(3, 4);
                let p = particle(0, this.team.body, [
                    ['s', rand(4, 8), 0, 0.1, d],
                ]);
                p.x = this.x + rand(-15, 15);
                p.y = this.y + rand(-15, 15);
            }
        }

        while (particles--) {
            const d = rand(0.6, 1);
            particle(0, this.team.body, [
                ['s', 10, 0, d],
                ['x', this.x + rand(-10, 10), this.x + rand(-50, 50), d],
                ['y', this.y + rand(-10, 10), this.y + rand(-50, 50), d]
            ]);
        }
    }

    closestVisibleTarget() {
        return pick(W.cyclables
            .filter(c => c.team && c.team != this.team)
            .filter(c => dist(c, this) < UNIT_ATTACK_RADIUS)
            .filter(c => !W.hasObstacleBetween(this, c))
            .sort((a, b) => dist(this, a) - dist(this, b)));
    }

    cycle(e) {
        this.moving = false;
        this.behavior.cycle(e);
    }

    render() {
        wrap(() => this.behavior.render());

        translate(this.x, this.y);
        rotate(this.angle);

        const sin = this.moving ? Math.sin(G.t * Math.PI * 4) : 0;
        const offset = sin * (UNIT_PX_SIZE / 2);

        translate(-UNIT_PX_SIZE * 1.5, -UNIT_PX_SIZE * 2.5);

        // Legs
        wrap(() => {
            translate(UNIT_PX_SIZE, 0);
            scale(sin, 1);
            R.fillStyle = this.team.leg;
            fillRect(0, UNIT_PX_SIZE, UNIT_PX_SIZE * 3, UNIT_PX_SIZE); // left
            fillRect(0, UNIT_PX_SIZE * 3, -UNIT_PX_SIZE * 3, UNIT_PX_SIZE); // right
        });

        // Left arm
        wrap(() => {
            translate(offset, 0);
            R.fillStyle = this.team.body;
            fillRect(UNIT_PX_SIZE, 0, UNIT_PX_SIZE * 2, UNIT_PX_SIZE);
            R.fillStyle = this.team.leg;
            fillRect(UNIT_PX_SIZE * 2, UNIT_PX_SIZE, UNIT_PX_SIZE * 2, UNIT_PX_SIZE);
        });

        // Right arm
        wrap(() => {
            translate(-offset, 0);
            R.fillStyle = this.team.body;
            fillRect(UNIT_PX_SIZE, UNIT_PX_SIZE * 4, UNIT_PX_SIZE * 2, UNIT_PX_SIZE);
            R.fillStyle = this.team.leg;
            fillRect(UNIT_PX_SIZE * 2, UNIT_PX_SIZE * 3, UNIT_PX_SIZE * 2, UNIT_PX_SIZE);
        });

        // Main body
        R.fillStyle = this.team.body;
        fillRect(0, UNIT_PX_SIZE, UNIT_PX_SIZE * 2, UNIT_PX_SIZE * 3);

        // Gun
        R.fillStyle = '#000';
        fillRect(UNIT_PX_SIZE * 3, UNIT_PX_SIZE * 2, UNIT_PX_SIZE * 3, UNIT_PX_SIZE);

        // Head
        R.fillStyle = this.team.head;
        fillRect(UNIT_PX_SIZE, UNIT_PX_SIZE, UNIT_PX_SIZE * 2, UNIT_PX_SIZE * 3);
    }

    postRender() {
        translate(this.x, this.y);

        // Second render pass, add health gauge
        R.fillStyle = '#000';
        fillRect(
            evaluate(-HEALTH_GAUGE_WIDTH / 2) - 1,
            -HEALTH_GAUGE_RADIUS - 1,
            evaluate(HEALTH_GAUGE_WIDTH + 2),
            evaluate(HEALTH_GAUGE_HEIGHT + 2)
        );

        R.fillStyle = this.health > 0.3 ? '#0f0' : '#f00';
        fillRect(
            evaluate(-HEALTH_GAUGE_WIDTH / 2),
            -HEALTH_GAUGE_RADIUS,
            HEALTH_GAUGE_WIDTH * this.health,
            HEALTH_GAUGE_HEIGHT
        );

        if (this.isSelected()) {
            R.fillStyle = '#fff';

            const corner = a => () => {
                translate(Math.cos(a) * SELECTED_EFFECT_RADIUS, Math.sin(a) * SELECTED_EFFECT_RADIUS);
                rotate(a + Math.PI * 3 / 4);
                fillRect(0, 0, 1, SELECTED_EFFECT_SIZE);
                fillRect(0, 0, SELECTED_EFFECT_SIZE, 1);
            };

            let i = 4;
            while (--i) {
                wrap(corner((i / 4) * Math.PI * 2 + Math.PI / 4));
            }
        }
    }

    goto(pt) {
        this.setBehavior(new Reach(pt));
    }

    setBehavior(b) {
        this.behavior = b;
        b.attach(this);
    }

    gotoShootable(pt) {
        this.path = W.findPath(this, pt, position => {
            if (dist(position, pt) > GRID_SIZE * 4) {
                return; // too far, no need to cast a ray
            }

            const angle = Math.atan2(pt.y - position.y, pt.x - position.x);
            const cast = W.castRay(position, angle, GRID_SIZE * 4);

            return dist(cast, position) > dist(pt, position);
        }) || [];
    }

    isSelected() {
        return G.selectedUnits.indexOf(this) >= 0;
    }

}
