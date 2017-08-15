class Cursor {

    constructor() {
        // Might be able to get rid of that if it's set from the outside
        this.x = 0;
        this.y = 0;
    }

    render() {
        // implement in subclasses
    }

    postRender() {
        // implement in subclasses
    }
}
