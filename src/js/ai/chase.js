class Chase extends Behavior {

    constructor(target) {
        super();
        this.target = target;
    }

    attach(unit) {
        super.attach(unit);

        this.nextCheck = 0;
        this.updateSubBehavior();
    }

    updateSubBehavior() {
        if (dist(this.unit, this.target) < UNIT_ATTACK_RADIUS && !W.hasObstacleBetween(this.unit, this.target)) {
            // Target is visible, attack!
            this.subBehavior = new Idle();
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
