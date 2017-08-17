class SelectionCursor extends Cursor {

    constructor() {
        super();
        this.selection = [];
    }

    postRender() {
        if (this && this.downPosition && dist(this, this.downPosition)) {
            R.strokeStyle = '#0f0';
            R.fillStyle = 'rgba(0,255,0,0.1)';
            R.lineWidth = 1;
            fillRect(
                this.downPosition.x,
                this.downPosition.y,
                this.x - this.downPosition.x,
                this.y - this.downPosition.y
            );
            strokeRect(
                this.downPosition.x,
                this.downPosition.y,
                this.x - this.downPosition.x,
                this.y - this.downPosition.y
            );
        }
    }

    move(p) {
        // Not calling super cause otherwise it will try to revert to this cursor
        this.x = p.x;
        this.y = p.y;

        if (this.downPosition) {
            this.selection = W.cyclables.filter(e => {
                return e.team === PLAYER_TEAM &&
                    isBetween(this.downPosition.x, e.x, this.x) &&
                    isBetween(this.downPosition.y, e.y, this.y);
            });
        }
    }

    up() {
        this.selection = W.cyclables.filter(e => {
            return e.team === PLAYER_TEAM &&
                isBetween(this.downPosition.x, e.x, this.x) &&
                isBetween(this.downPosition.y, e.y, this.y);
        });

        super.up();
    }

    get units() {
        return this.selection.filter(unit => !unit.dead);
    }

}
