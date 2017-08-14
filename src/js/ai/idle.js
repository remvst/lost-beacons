class Idle extends Behavior {

    reconsider() {
        const target = this.unit.closestVisibleTarget();
        return target ? new AttackStill(target) : this;
    }

}
