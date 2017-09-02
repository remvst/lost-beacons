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

        W.add({
            'cycle': () => {
                if (!G.selectionCursor.selection.length && !G.selectionCursor.downPosition) {
                    if (!W.selectHint) {
                        W.selectHint = new SelectHelp();
                        W.selectHint.x = W.units[0].x - SELECT_HELP_SIZE / 2;
                        W.selectHint.y = W.units[0].y - SELECT_HELP_SIZE / 2;
                        W.add(W.selectHint, RENDERABLE);

                        W.selectHint.animate(() => {
                            W.remove(W.selectHint);
                            W.selectHint = null;
                        });
                    }
                } else {
                    W.remove(W.selectHint);
                }
            }
        }, CYCLABLE);
    }

    render() {
        super.render();

        wrap(() => {
            R.globalAlpha = W.textAlpha;
            drawCenteredText(nomangle('lost beacons'), CANVAS_WIDTH / 2, 200, 16, '#a51', true);
            drawCenteredText(nomangle('tactical territory control'), CANVAS_WIDTH / 2, 200 + 16 * 7, 5, '#fff', true);

            let s;
            if (!G.selectionCursor.selection.length) {
                s = nomangle('click left     to select units');
                G.reachCursor.sentUnits = false;
                fakeMouse(455, 850 + 5 * 5 / 2, LEFT_CLICK);
            } else if (!G.reachCursor.sentUnits) {
                s = nomangle('click right     to send units');
                fakeMouse(485, 850 + 5 * 5 / 2, RIGHT_CLICK);
            } else {
                s = nomangle('capture the beacon to start');
            }
            drawCenteredText(s, CANVAS_WIDTH / 2, 850, 5, '#fff', true);

            const labels = [nomangle('--- best times ---')];
            let i = 0;
            while (true) {
                const time = TimeData.timeForLevelIndex(++i);
                if (!time) {
                    break;
                }
                labels.unshift(nomangle('sector #') + zeroes(i) + ' - ' + formatTime(time));
            }

            if (i > 1) {
                labels.forEach((label, i) => {
                    drawText(label, 10, CANVAS_HEIGHT - (i + 1) * 7 * 2, 2, '#fff', true);
                });
            }
        });
    }

    launch() {
        interp(W, 'textAlpha', 1, 0, 0.5, 0, 0, () => {
            delayed(() => W.animatePolygons(1, 0), 500);
            interp(W, 'flashAlpha', 0, 1, 1, 0.5, 0, () => G.launch(GameplayWorld));
        });
    }

}
