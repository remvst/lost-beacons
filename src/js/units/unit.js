class Unit {

    constructor() {
        // Might be able to gut these if they're set from the outside
        this.x = 0;
        this.y = 0;
        this.color = '#4c2';
    }

    cycle(e) {
        // TODO
    }

    render() {
        R.save();
        R.translate(this.x, this.y);
        R.fillStyle = this.color;
        R.fillRect(-10, -10, 20, 20);
        R.restore();
    }

}
