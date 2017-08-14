class AttackStill extends Behavior {

    constructor(target) {
        super();
        this.target = target;
    }

    cycle(e) {
        super.cycle(e);
        this.unit.angle = angleBetween(this.unit, this.target);
    }

    reconsider() {
        if (!W.hasObstacleBetween(this.unit, this.target)) {
            // Target is still visible, keep attacking it
            // TODO also check that target is alive
            return this;
        }

        const target = this.unit.closestVisibleTarget();

        return target ? new AttackStill(target) : new Idle();
    }

}
