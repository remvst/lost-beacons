const squareFocus = (r, s) => {
    const corner = a => () => {
        translate(cos(a) * r, sin(a) * r);
        rotate(a + PI * 3 / 4);
        fr(0, 0, 1, s);
        fr(0, 0, s, 1);
    };

    let i = 4;
    while (i--) {
        wrap(corner((i / 4) * PI * 2 + PI / 4));
    }
};
