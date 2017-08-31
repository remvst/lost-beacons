class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        // this.x = 0;
        // this.y = 0;
        // this.team = PLAYER_TEAM;
        // this.target = null;

        this.angle = 0;
        this.moving = false;

        this.health = 1;

        this.setBehavior(new Idle());

        this.nextShot = rand(0.2, 1);

        this.indicator = new Indicator(this);
    }

    get dead() {
        return !this.health;
    }

    hurt(amount) {
        if ((this.health -= amount) < 0.1) {
            this.health = 0;
        }

        if (this.team == PLAYER_TEAM) {
            this.indicator.indicate(nomangle('unit under attack'), ENEMY_TEAM.beacon);
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

        const bloodDelay = rand(3, 4);
        let p = particle(0, this.team.body, [
            ['s', rand(4, 8), 0, 0.1, bloodDelay],
        ]);
        p.x = this.x + rand(-15, 15);
        p.y = this.y + rand(-15, 15);

        while (particles--) {
            const d = rand(0.6, 1);
            particle(0, this.team.body, [
                ['s', 10, 0, d],
                ['x', this.x + rand(-10, 10), this.x + rand(-50, 50), d],
                ['y', this.y + rand(-10, 10), this.y + rand(-50, 50), d]
            ]);
        }
    }

    heal(amount) {
        if (!this.dead) {
            this.health = min(1, this.health + amount);
        }
    }

    closestVisibleTarget() {
        return W.units
            .filter(c => c.team != this.team)
            .filter(c => dist(c, this) < UNIT_ATTACK_RADIUS)
            .filter(c => !W.hasObstacleBetween(this, c))
            .sort((a, b) => dist(this, a) - dist(this, b))
            [0];
    }

    cycle(e) {
        this.moving = false;
        this.behavior.cycle(e);

        if (!this.moving && this.target && !this.target.dead) {
            this.angle = angleBetween(this, this.target);
        }

        const healing = this.target && this.target.team == this.team;

        if (!this.moving && (this.nextShot -= e) <= 0) {
            this.nextShot = UNIT_SHOT_INTERVAL;

            // If the target is dead or not accessible, we can't do the action on it
            const notActionable = !this.target ||
                this.target.dead ||
                dist(this, this.target) > (healing ? UNIT_HEAL_RADIUS : UNIT_ATTACK_RADIUS) ||
                W.hasObstacleBetween(this, this.target);

            if (healing) {
                // Healing a friendly unit

                if (this.target.health == 1 || this.target == this) {
                    // stop healing, target is already at full health (and allows us to start shooting at another target)
                    this.target = null;
                } else if (!notActionable) {
                    const target = this.target;

                    const p = {
                        'progress': 0,
                        'postRender': () => {
                            translate(this.x + p.progress * (target.x - this.x), this.y + p.progress * (target.y - this.y));

                            R.fillStyle = this.team.beacon;
                            fillRect(-2, -6, 4, 12);
                            fillRect(-6, -2, 12, 4);
                        }
                    };

                    W.add(p, RENDERABLE);

                    interp(p, 'progress', 0, 1, dist(this, this.target) / 100, 0, null, () => {
                        target.heal(UNIT_HEALING_AMOUNT);
                        W.remove(p);
                    });
                }

            } else {
                // Shooting

                if (notActionable) {
                    // Pick a different target if the current one isn't available
                    this.target = this.closestVisibleTarget();
                }

                if (this.target) {
                    const view = {
                        'alpha': 1,
                        'render': () => {
                            R.globalAlpha = this.alpha;
                            R.strokeStyle = '#ff0';
                            R.lineWidth = 0.5;
                            beginPath();
                            moveTo(this.x, this.y);
                            lineTo(this.target.x, this.target.y);
                            stroke();
                        }
                    };
                    W.add(view, RENDERABLE);

                    interp(view, 'alpha', 0.5, 0, 0.1, 0, null, () => W.remove(view));

                    this.target.hurt(SHOT_DAMAGE);
                }
            }
        }
    }

    render() {
        wrap(() => this.behavior.render());

        translate(this.x, this.y);
        rotate(this.angle);

        const sinusoidal = this.moving ? sin(G.t * PI * 4) : 0;
        const offset = sinusoidal * (UNIT_PX_SIZE / 2);

        translate(-UNIT_PX_SIZE * 1.5, -UNIT_PX_SIZE * 2.5);

        // Legs
        wrap(() => {
            translate(UNIT_PX_SIZE, 0);
            scale(sinusoidal, 1);
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
        this.indicator.postRender();

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
            squareFocus(SELECTED_EFFECT_RADIUS, SELECTED_EFFECT_SIZE);
        }
    }

    goto(pt) {
        this.setBehavior(new Reach(pt));
    }

    setBehavior(b) {
        this.behavior = b;
        b.attach(this);
    }

    isSelected() {
        return G.selectionCursor.units.indexOf(this) >= 0;
    }

}
