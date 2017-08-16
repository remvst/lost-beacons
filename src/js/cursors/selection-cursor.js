class SelectionCursor extends Cursor {

    constructor() {
        super();
        this.selection = [];
    }

    postRender() {
        if (this.currentPosition && this.downPosition && dist(this.currentPosition, this.downPosition)) {
            R.strokeStyle = '#0f0';
            R.fillStyle = 'rgba(0,255,0,0.1)';
            R.lineWidth = 1;
            fillRect(
                this.downPosition.x,
                this.downPosition.y,
                this.currentPosition.x - this.downPosition.x,
                this.currentPosition.y - this.downPosition.y
            );
            strokeRect(
                this.downPosition.x,
                this.downPosition.y,
                this.currentPosition.x - this.downPosition.x,
                this.currentPosition.y - this.downPosition.y
            );
        }
    }

    move(p) {
        this.currentPosition = p;

        if (this.downPosition) {
            this.selection = W.cyclables.filter(e => {
                return e.team === PLAYER_TEAM &&
                    isBetween(this.downPosition.x, e.x, this.currentPosition.x) &&
                    isBetween(this.downPosition.y, e.y, this.currentPosition.y);
            });
        }
    }

    up() {
        this.selection = W.cyclables.filter(e => {
            return e.team === PLAYER_TEAM &&
                isBetween(this.downPosition.x, e.x, this.currentPosition.x) &&
                isBetween(this.downPosition.y, e.y, this.currentPosition.y);
        });

        super.up();
    }

    get units() {
        return this.selection.filter(unit => !unit.dead);
    }

}
