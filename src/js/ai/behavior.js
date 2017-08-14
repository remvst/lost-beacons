class Behavior {

    constructor() {
        this.nextReconsideration = 1;
    }

    cycle(e) {
        this.nextReconsideration -= e;
        if (this.nextReconsideration < 0) {
            this.unit.setBehavior(this.reconsider());
        }
    }

    reconsider() {
        // implement in subclasses
        return this;
    }

    render() {
        
    }

}
