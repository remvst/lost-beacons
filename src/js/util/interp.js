function linear(t, b, c, d) {
    return (t / d) * c + b;
}

function interp(o, p, a, b, d, l, f, e) {
    var i = {
        o: o, // object
        p: p, // property
        a: a, // from
        b: b, // to
        d: d, // duration
        l: l || 0, // delay
        f: f || linear, // easing function
        e: e, // end callback
        t: 0,
        cycle: function(e){
            if (i.l > 0) {
                i.l -= e;
                i.o[i.p] = i.a;
            } else {
                i.t = Math.min(i.d, i.t + e);
                i.o[i.p] = i.f(i.t, i.a, i.b - i.a, i.d);
                if(i.t == i.d){
                    if(i.e){
                        i.e();
                    }
                    W.remove(i);
                }
            }
        }
    };
    W.add(i, CYCLABLE);
}
