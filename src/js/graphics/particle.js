function particle(s, c, as) {
    let p;

    // Add to the list of particles
    W.add(p = {
        s: s,
        c: c,
        render: function(){
            if(!V.contains(this.x, this.y, this.s)){
                return;
            }

            R.fillStyle = p.c;
            R.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        }
    }, RENDERABLE | FIRST);

    // Interpolations
    as.forEach(function(a, id){
        const args = [p].concat(a);

        // Add the remove callback
        if(!id){
            args[7] = () => W.remove(p);
        }

        // Apply the interpolation
        interp.apply(0, args);
    });

    return p;
}
