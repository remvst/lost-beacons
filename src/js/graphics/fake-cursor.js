class FakeCursor {

    postRender() {
        translate(this.x, this.y);

        const a = PI / 2 - PI / 4;

        R.fillStyle = '#fff';
        R.strokeStyle = '#000';
        beginPath();
        moveTo(0, 0);
        lineTo(0, 20);
        lineTo(cos(a) * 20, sin(a) * 20);
        closePath();

        fill();
        stroke();
    }

}
