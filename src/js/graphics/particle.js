function particle(s, c, as, post) {
    let p;

    // Add to the list of particles
    W.add(p = {
        's': s,
        'c': c
    }, RENDERABLE | FIRST);

    p[post ? 'postRender' : 'render'] = () => {
        if(!V.contains(p.x, p.y, p.s)){
            return;
        }

        R.fillStyle = p.c;
        fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    };

    // Interpolations
    as.forEach((a, i) => {
        const args = [p].concat(a);

        // Add the remove callback
        if(!i){
            args[7] = () => W.remove(p);
        }

        // Apply the interpolation
        interp.apply(0, args);
    });

    return p;
}
