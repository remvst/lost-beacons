class GameplayWorld extends World {

    initialize() {
        W.map = generate();

        W.symSquad(
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 2)),
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 2)),
            5
        );

        W.symSquad(
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 5)),
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 2)),
            5
        );

        W.symSquad(
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 8)),
            evaluate(GRID_SIZE * (GRID_EMPTY_PADDING / 2 + GRID_OBSTACLE_PADDING + 2)),
            5
        );

        for (let i = 0 ; i < 10 ; i++) {
            W.spawnBeacon();
        }

        const endCheck = {
            'cycle': () => {
                const playerUnits = W.units.filter(unit => unit.team == PLAYER_TEAM).length;
                const playerBeacons = W.beacons.filter(beacon => beacon.team == PLAYER_TEAM).length;
                const enemyBeacons = W.beacons.filter(beacon => beacon.team == ENEMY_TEAM).length;

                // End if someone captured all beacons OR if the player is completely dead
                if (!playerUnits || max(enemyBeacons, playerBeacons) == W.beacons.length) {
                    this.gameOver(!enemyBeacons);
                    W.remove(endCheck);
                }
            }
        };
        W.add(endCheck, CYCLABLE);

        W.pauseAndAnnounce(nomangle('capture all beacons to win'));
    }

    pauseAndAnnounce(s, callback) {
        const cyclables = W.cyclables.slice(0);
        W.cyclables = [V];
        W.add(new Announcement(s, () => {
            W.cyclables = cyclables;
            if (callback) {
                callback();
            }
        }), RENDERABLE);
    }

    // Spawns squads for each team at opposite sides of the map
    symSquad(x, y, size) {
        W.squad(x, y, PLAYER_TEAM, size);
        W.squad(W.width - x, W.height - y, ENEMY_TEAM, size);
    }

    renderMinimap() {
        wrap(() => {
            translate(CANVAS_WIDTH - W.width * MINIMAP_SCALE - MINIMAP_MARGIN, CANVAS_HEIGHT - W.height * MINIMAP_SCALE - MINIMAP_MARGIN);

            R.globalAlpha = 0.5;
            R.strokeStyle = '#fff';
            R.lineWidth = 2;

            R.fillStyle = '#000';
            fillRect(4, 4, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));

            R.fillStyle = '#444';
            fillRect(0, 0, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));

            R.fillStyle = '#6cf';
            R.globalAlpha = 1;
            W.map.forEach((r, row) => {
                r.forEach((x, col) => {
                    if (x) {
                        fillRect(
                            round(col * GRID_SIZE * MINIMAP_SCALE),
                            round(row * GRID_SIZE * MINIMAP_SCALE),
                            round(MINIMAP_SCALE * GRID_SIZE),
                            round(MINIMAP_SCALE * GRID_SIZE)
                        );
                    }
                });
            });

            R.lineWidth = 1;
            R.fillStyle = '#fff';
            R.strokeStyle = '#000';
            R.globalAlpha = 0.2;
            fillRect(
                ~~(V.x * MINIMAP_SCALE),
                ~~(V.y * MINIMAP_SCALE),
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );

            R.globalAlpha = 1;
            strokeRect(
                ~~(V.x * MINIMAP_SCALE) + 0.5,
                ~~(V.y * MINIMAP_SCALE) + 0.5,
                ~~(CANVAS_WIDTH * MINIMAP_SCALE),
                ~~(CANVAS_HEIGHT * MINIMAP_SCALE)
            );

            R.globalAlpha = 1;
            W.units
                .forEach(c => {
                    R.fillStyle = c.team.body;
                    fillRect(c.x * MINIMAP_SCALE - 1, c.y * MINIMAP_SCALE - 1, 2, 2);
                });

            W.beacons
                .forEach(beacon => {
                    R.fillStyle = beacon.team.beacon;
                    wrap(() => {
                        translate(beacon.x * MINIMAP_SCALE, beacon.y * MINIMAP_SCALE);
                        squareFocus(8, 4);
                    });
                });

            R.lineWidth = 1;
            R.strokeStyle = '#000';
            strokeRect(0.5, 0.5, ~~(W.width * MINIMAP_SCALE), ~~(W.height * MINIMAP_SCALE));
        });
    }

    renderHUD() {
        R.fillStyle = 'rgba(255,255,255,.15)';
        fillRect(0, ~~(G.t * 100) % CANVAS_HEIGHT * 1.5, CANVAS_WIDTH, 0.5);

        R.fillStyle = 'rgba(255,255,255,.02)';
        fillRect(0, ~~(G.t * 50) % CANVAS_HEIGHT * 1.5, CANVAS_WIDTH, 100);

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT - HUD_HEIGHT);

            R.fillStyle = G.hudGradient;
            fillRect(-CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, HUD_HEIGHT);

            R.fillStyle = G.hudBg;
            R.strokeStyle = '#000';
            beginPath();
            moveTo(-220, HUD_HEIGHT);
            lineTo(-170, 0.5);
            lineTo(170, 0.5);
            lineTo(220, HUD_HEIGHT);
            fill();
            stroke();

            drawCenteredText(nomangle('beacons'), 0, 20, HUD_SCORE_CELL_SIZE, '#fff', true);
            drawCenteredText(nomangle('units'), 0, 40, HUD_SCORE_CELL_SIZE, '#fff', true);

            function gauge(x, y, value, sign, color) {
                const w = (5 + value * 10) * sign;

                R.fillStyle = '#000';
                fillRect(x + 2, y + 2, w, HUD_SCORE_CELL_SIZE * 5);

                R.fillStyle = color;
                fillRect(x, y, w, HUD_SCORE_CELL_SIZE * 5);

                drawCenteredText('' + value, x + w + sign * 15, y, HUD_SCORE_CELL_SIZE, color, true);
            }

            gauge(-HUD_GAUGE_GAP / 2, 20, G.beaconsScore(PLAYER_TEAM), -1, '#0f0');
            gauge(HUD_GAUGE_GAP / 2, 20, G.beaconsScore(ENEMY_TEAM), 1, '#f00');

            gauge(-HUD_GAUGE_GAP / 2, 40, G.unitsScore(PLAYER_TEAM), -1, '#0f0');
            gauge(HUD_GAUGE_GAP / 2, 40, G.unitsScore(ENEMY_TEAM), 1, '#f00');
        });

        drawCenteredText(nomangle('wasd/arrows: move the camera  -  left click: select units  -  right click: send units'), CANVAS_WIDTH / 2, 10, 2, '#888');
    }

    gameOver(win) {
        W.pauseAndAnnounce(win ? nomangle('victory') : nomangle('you were defeated'), () => {
            G.launch(MenuWorld);
        });
    }

}
