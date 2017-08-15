class Autonomous extends Behavior {

    attach(unit) {
        super.attach(unit);

        this.nextCheck = 0;
        this.updateSubBehavior();
    }

    updateSubBehavior() {
        this.subBehavior = new Idle();
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
        return this; // never change the AI
    }

    render() {
        this.subBehavior.render();
    }

    reservedPosition() {
        return this.subBehavior.reservedPosition();
    }

}
