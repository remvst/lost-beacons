class Behavior {

    attach(unit) {
        this.nextReconsideration = 1;
        this.unit = unit;
    }

    cycle(e) {
        this.nextReconsideration -= e;
        if (
            this.nextReconsideration < 0 &&
            this.unit.behavior === this // useful when used as a subBehavior
        ) {
            this.unit.setBehavior(this.reconsider());
        }
    }

    reconsider() {
        // implement in subclasses
        return this;
    }

    render() {
        if (DEBUG) {
            R.fillStyle = '#f00';
            R.font = '10pt Arial';
            R.textAlign = 'center';
            fillText(this.constructor.name, this.unit.x, this.unit.y + 50);
        }
    }

    reservedPosition() {
        return {'x': this.unit.x, 'y': this.unit.y};
    }

}
