class LevelWorld extends World {

    initialize() {
        let maxLevel = 0;
        while (true) {
            const time = TimeData.timeForLevelIndex(++maxLevel);
            if (!time) {
                break;
            }
        }
        maxLevel++;

        function concatMatrices(m1, m2) {
            const res = [];

            for (let row = 0 ; row < m1.length ; row++) {
                res.push(m1[row].concat(m2[row]));
            }

            return res;
        }

        const leftMatrix = matrix([
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]);

        const levelMatrix = matrix([
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]);

        const rightMatrix = matrix([
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]);

        let fullMatrix = leftMatrix;

        W.levelLabels = [];

        for (let i = 0 ; i < maxLevel - 1 ; i++) {
            fullMatrix = concatMatrices(fullMatrix, levelMatrix);

            const levelId = i + 1;

            const beacon = new Beacon();
            beacon.x = (leftMatrix[0].length + (i + 0.5) * levelMatrix[0].length) * GRID_SIZE;
            beacon.y = ~~(leftMatrix.length / 2) * GRID_SIZE;
            beacon.indicator.postRender = () => 0;
            W.add(beacon, CYCLABLE | RENDERABLE | BEACON | FIRST);

            W.levelLabels.push({
                'x': beacon.x,
                'y': beacon.y + GRID_SIZE * 4.7,
                'label': nomangle('sector #') + zeroes(levelId),
                'size': 4
            });

            const time = TimeData.timeForLevelIndex(levelId);
            W.levelLabels.push({
                'x': beacon.x,
                'y': beacon.y + GRID_SIZE * 5.3,
                'label': time ? formatTime(time) : 'not secured',
                'size': 3
            });

            const checker = {
                'cycle': () => {
                    if (beacon.team == PLAYER_TEAM) {
                        this.launch(levelId);
                        W.remove(checker);
                    }
                }
            };
            W.add(checker, CYCLABLE);
        }

        fullMatrix = concatMatrices(fullMatrix, rightMatrix);

        W.matrix = fullMatrix;

        W.squad(V.center.x - 300, V.center.y, PLAYER_TEAM, 5);

        interp(W, 'textAlpha', 0, 1, 0.5, 0.8);

        W.add({
            'cycle': () => {
                if (!G.selectionCursor.selection.length && !G.selectionCursor.downPosition) {
                    if (!W.selectHint) {
                        W.selectHint = new SelectHelp(() => {
                            W.remove(W.selectHint);
                            W.selectHint = null;
                        });
                        W.selectHint.x = W.units[0].x - SELECT_HELP_SIZE / 2;
                        W.selectHint.y = W.units[0].y - SELECT_HELP_SIZE / 2;
                        W.add(W.selectHint, RENDERABLE);
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

            translate(-~~V.x, -~~V.y);

            W.levelLabels.forEach(label => {
                const x = label.x + (label.x - V.center.x) / PERSPECTIVE * GRID_SIZE;
                const y = label.y + (label.y - V.center.y) / PERSPECTIVE * GRID_SIZE;

                drawCenteredText(label.label, x, y - label.size * 5 / 2, label.size, '#fff', true);
            });
        });

        wrap(() => {
            drawCenteredText(nomangle('select a sector'), CANVAS_WIDTH / 2, 850, 5, '#fff', true);
        });
    }

    launch(levelId) {
        console.log('launching level', levelId);
        G.levelId = levelId - 1; // OMG SO DIRTY

        interp(W, 'textAlpha', 1, 0, 0.5, 0, 0, () => {
            delayed(() => W.animatePolygons(1, 0), 500);
            interp(W, 'flashAlpha', 0, 1, 1, 0.5, 0, () => G.launch(GameplayWorld));
        });
    }

}
