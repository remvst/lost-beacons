class Chase extends Behavior {

    constructor(target, radius = UNIT_ATTACK_RADIUS) {
        super();
        this.target = target;
        this.radius = radius;
    }

    attach(unit) {
        super.attach(unit);

        this.nextCheck = 0;
        this.updateSubBehavior();
    }

    updateSubBehavior() {
        if (dist(this.unit, this.target) < this.radius && !W.hasObstacleBetween(this.unit, this.target)) {
            // Target is visible, attack!
            this.subBehavior = new Idle();

            // Make sure we're focusing on this specific unit (to avoid having the unit auto-attack another target)
            this.unit.target = this.target;
            this.unit.healing = this.target.team == this.unit.team;
        } else {
            this.subBehavior = new Reach(this.target);
        }

        this.subBehavior.attach(this.unit);
    }

    cycle(e) {
        super.cycle(e);

        this.nextCheck -= e;
        if (this.nextCheck <= 0) {
            this.nextCheck = 1;
            this.updateSubBehavior();
        }

        if (this.subBehavior) {
            this.subBehavior.cycle(e);
        }
    }

    reconsider() {
        return this.target.dead ? new Idle() : this;
    }

    render() {
        this.subBehavior.render();
    }

    reservedPosition() {
        return this.subBehavior.reservedPosition();
    }

}
