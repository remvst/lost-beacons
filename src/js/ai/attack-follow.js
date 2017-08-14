class AttackFollow extends Behavior {

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
            // TODO also check that target is alive
            this.subBehavior = new AttackStill(this.target);
        } else {
            this.subBehavior = new Reach(this.target);
        }

        this.subBehavior.attach(this.unit);
    }

    cycle(e) {
        this.nextCheck -= e;
        if (this.nextCheck <= 0) {
            this.nextCheck = 1;
            this.updateSubBehavior();
        }

        if (this.subBehavior) {
            this.subBehavior.unit = this.unit;
            this.subBehavior.cycle(e);
        }
    }

    reconsider() {
        // TODO if target is destroyed, switch to still
        return this;
    }

    render() {
        this.subBehavior.render();
    }

}
