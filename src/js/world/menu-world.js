class MenuWorld extends World {

    initialize() {
        W.matrix = matrix([
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]);

        W.squad(V.center.x - 300, V.center.y, PLAYER_TEAM, 5);

        const beacon = new Beacon();
        beacon.x = V.center.x + 300;
        beacon.y = V.center.y;
        beacon.indicator.postRender = () => 0;
        W.add(beacon, CYCLABLE | RENDERABLE | BEACON | FIRST);

        const checker = {
            'cycle': () => {
                if (beacon.team == PLAYER_TEAM) {
                    this.launch();
                    W.remove(checker);
                }
            }
        };
        W.add(checker, CYCLABLE);

        interp(W, 'textAlpha', 0, 1, 0.5, 0.8);

        W.add({
            'cycle': () => {
                V.x = (W.width - CANVAS_WIDTH) / 2;
                V.y = (W.width - CANVAS_HEIGHT) / 2;
            }
        }, CYCLABLE);

        // That should totally not be here but hey, we need the bytes
        G.levelId = 0;
    }

    render() {
        super.render();

        wrap(() => {
            R.globalAlpha = W.textAlpha;
            drawCenteredText(nomangle('lost beacons'), CANVAS_WIDTH / 2, 200, 16, '#a51', true);
            drawCenteredText(nomangle('tactical territory control'), CANVAS_WIDTH / 2, 200 + 16 * 7, 5, '#fff', true);

            let s;
            if (!G.selectionCursor.selection.length) {
                s = nomangle('click left to select units');
                G.reachCursor.sentUnits = false;
            } else if (!G.reachCursor.sentUnits) {
                s = nomangle('click right to send units');
            } else {
                s = nomangle('capture the beacon to start');
            }
            drawCenteredText(s, CANVAS_WIDTH / 2, 850, 5, '#fff', true);
        });
    }

    launch() {
        interp(W, 'textAlpha', 1, 0, 0.5, 0, 0, () => {
            delayed(() => W.animatePolygons(1, 0), 500);
            interp(W, 'flashAlpha', 0, 1, 1, 0.5, 0, () => G.launch(GameplayWorld));
        });
    }

}
