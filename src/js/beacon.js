const REINFORCEMENTS_STRING = nomangle('reinforcements');

class Beacon {

    constructor() {
        // Get rid of those if theyre set externally
        this.x = 0;
        this.y = 0;

        this.team = NEUTRAL_TEAM;
        this.teamOwnedFactor = 0;
        this.conqueringTeam = null;
        this.conqueringOwnedFactor = 0;

        this.enemyTeamOwned = 0;
        this.playerTeamOwned = 0;

        this.nextParticle = 0;

        this.nextReinforcements = 0;

        this.indicator = new Indicator(this);
    }

    cycle(e) {
        const units = W.units.filter(u => dist(u, this) < BEACON_CONQUER_RADIUS);
        const player = units.filter(unit => unit.team == PLAYER_TEAM);
        const enemy = units.filter(unit => unit.team == ENEMY_TEAM);

        let actualConqueringTeam;
        let isConquering;
        if (enemy.length > player.length) {
            actualConqueringTeam = ENEMY_TEAM;
            isConquering = this.enemyTeamOwned < 1;
        } else if (enemy.length < player.length) {
            actualConqueringTeam = PLAYER_TEAM;
            isConquering = this.playerTeamOwned < 1;
        }

        this.nextParticle -= e;
        if (this.nextParticle < 0 && isConquering) {
            this.nextParticle = 0.2;

            const unit = pick(actualConqueringTeam == ENEMY_TEAM ? enemy : player);
            const t = rand(0.5, 1.5);
            particle(5, actualConqueringTeam.body, [
                ['x', unit.x, this.x, t, 0],
                ['y', unit.y, this.y, t, 0],
                ['s', 0, rand(5, 10), t]
            ], true);
        }

        let playerOwnedSign = 0;
        let enemyOwnedSign = 0;
        if (actualConqueringTeam == ENEMY_TEAM) {
            playerOwnedSign = -1;
            enemyOwnedSign = this.playerTeamOwned > 0 ? 0 : 1;
        } else if (actualConqueringTeam == PLAYER_TEAM) {
            enemyOwnedSign = -1;
            playerOwnedSign = this.enemyTeamOwned > 0 ? 0 : 1;
        } else if (units.length == 0) {
            playerOwnedSign = this.team == PLAYER_TEAM ? 1 : -1;
            enemyOwnedSign = this.team == ENEMY_TEAM ? 1 : -1;
            // Otherwise, it means we have a tie, so let's not move ownership at all
        }

        const factor = BEACON_CONQUER_SPEED_PER_UNIT * between(1, abs(player.length - enemy.length), BEACON_MAX_CONQUERING_UNITS);

        this.playerTeamOwned = max(0, min(1, this.playerTeamOwned + playerOwnedSign * factor * e));
        this.enemyTeamOwned = max(0, min(1, this.enemyTeamOwned + enemyOwnedSign * factor * e));

        let newOwner;
        if (this.playerTeamOwned == 1) {
            newOwner = PLAYER_TEAM;
        } else if (this.enemyTeamOwned == 1) {
            newOwner = ENEMY_TEAM;
        } else if (!this.playerTeamOwned && !this.enemyTeamOwned) {
            newOwner = NEUTRAL_TEAM;
        }

        if (newOwner && newOwner != this.team) {
            this.team = newOwner;

            this.conqueredAnimation();

            this.nextReinforcements = this.team.reinforcementsInterval;

            if (newOwner == PLAYER_TEAM) {
                this.indicator.indicate(nomangle('beacon captured'), this.team.beacon);
            } else if (newOwner == ENEMY_TEAM) {
                this.indicator.indicate(nomangle('enemy captured beacon'), this.team.beacon);
            } else if (actualConqueringTeam == ENEMY_TEAM) {
                this.indicator.indicate(nomangle('beacon lost'), this.team.beacon);
            }
        }

        if ((this.nextReinforcements -= e) < 0) {
            if (this.team == ENEMY_TEAM) {
                // Enemies spawn reinforcements automatically
                this.reinforcements();
            } else if (this.team == PLAYER_TEAM) {
                // Player needs to click a button
                this.indicator.indicate(nomangle('reinforcements ready'), PLAYER_TEAM.beacon);
            }
        }
    }

    reinforcements() {
        this.nextReinforcements = this.team.reinforcementsInterval;

        const unit = new Unit();
        unit.x = this.x;
        unit.y = this.y;
        unit.team = this.team;
        W.add(unit, CYCLABLE | RENDERABLE | UNIT);

        unit.setBehavior(this.team.behavior(this));

        this.indicator.indicate(this.team == ENEMY_TEAM ? nomangle('enemy reinforcements') : nomangle('reinforcements'), this.team.beacon);
    }

    render() {
        translate(this.x, this.y);

        R.fillStyle = '#000';
        fillRect(-BEACON_BASE_RADIUS / 2, -BEACON_BASE_THICKNESS / 2, BEACON_BASE_RADIUS, BEACON_BASE_THICKNESS);
        fillRect(-BEACON_BASE_THICKNESS / 2, -BEACON_BASE_RADIUS / 2, BEACON_BASE_THICKNESS, BEACON_BASE_RADIUS);

        const s = (G.t % BEACON_CENTER_PERIOD) / BEACON_CENTER_PERIOD;

        R.fillStyle = R.strokeStyle = this.team.beacon;
        beginPath();
        arc(0, 0, BEACON_CENTER_RADIUS * s, 0, PI * 2, true);
        fill();

        R.globalAlpha = 1 - s;
        beginPath();
        arc(0, 0, BEACON_CENTER_RADIUS, 0, PI * 2, true);
        fill();

        R.globalAlpha = 0.5;

        [
            -G.t * PI * 2,
            -G.t * PI * 2 + PI
        ].forEach(angle => this.drawArc(angle, BEACON_ARC_RADIUS));

        [
            G.t * PI * 3,
            G.t * PI * 3 + PI
        ].forEach(angle => this.drawArc(angle, BEACON_ARC_RADIUS + 2));
    }

    inReinforcementsButton(position) {
        const bounds = this.reinforcementsButtonBounds();
        return this.nextReinforcements < 0 && this.team == PLAYER_TEAM &&
            isBetween(bounds.x, position.x, bounds.x + bounds.width) &&
            isBetween(bounds.y, position.y, bounds.y + bounds.height);
    }

    reinforcementsButtonBounds() {
        const width = requiredCells(REINFORCEMENTS_STRING) * BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE + (BEACON_REINFORCEMENTS_BUTTON_PADDING + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS) * 2;
        return {
            'x': this.x - width / 2,
            'y': this.y + BEACON_REINFORCEMENTS_BUTTON_Y,
            'width': width,
            'height': 5 * BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE + (BEACON_REINFORCEMENTS_BUTTON_PADDING + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS) * 2
        };
    }

    maybeClick(position) {
        if (this.inReinforcementsButton(position)) {
            this.reinforcements();
            return true;
        }
    }

    postRender() {
        wrap(() => this.indicator.postRender());

        if (this.team != NEUTRAL_TEAM && W instanceof GameplayWorld) {
            const buttonBounds = this.reinforcementsButtonBounds();

            if (this.nextReinforcements > 0) {
                drawCenteredText(REINFORCEMENTS_STRING, this.x, buttonBounds.y, BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE, this.team.beacon, true);
                drawCenteredText(formatTime(this.nextReinforcements), this.x, buttonBounds.y + 14, BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE, this.team.beacon, true);
            } else {
                // Border
                R.fillStyle = PLAYER_TEAM.beacon; // only the player ever needs to click the button
                fillRect(
                    buttonBounds.x,
                    buttonBounds.y,
                    buttonBounds.width,
                    buttonBounds.height
                );

                // Bottom part (with reflection)
                R.fillStyle = '#444';
                fillRect(
                    buttonBounds.x + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.y + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.width - 2 * BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.height - BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS * 2
                );

                // Top part (no reflection)
                R.fillStyle = '#000';
                fillRect(
                    buttonBounds.x + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.y + BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.width - 2 * BEACON_REINFORCEMENTS_BUTTON_BORDER_THICKNESS,
                    buttonBounds.height / 2
                );

                drawCenteredText(
                    REINFORCEMENTS_STRING,
                    this.x,
                    buttonBounds.y + (buttonBounds.height - 5 * BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE) / 2,
                    BEACON_REINFORCEMENTS_BUTTON_CELL_SIZE,
                    PLAYER_TEAM.beacon,
                    true
                );

            }
        }

        translate(this.x, this.y);

        const s =  (G.t % BEACON_WAVE_PERIOD) / BEACON_WAVE_PERIOD;
        R.strokeStyle = this.team.beacon;
        R.lineWidth = 2;
        R.globalAlpha = s;
        beginPath();
        arc(0, 0, 80 * (1 - s), 0, PI * 2, true);
        stroke();

        if (DEBUG) {
            fillText(roundP(this.playerTeamOwned, 0.1) + ' - ' + roundP(this.enemyTeamOwned, 0.1), 0, 50);
        }

        const maxOwned = max(this.enemyTeamOwned, this.playerTeamOwned);
        if (maxOwned && maxOwned < 1) {
            R.globalAlpha = 1;
            R.fillStyle = '#000';
            fillRect(
                evaluate(-BEACON_GAUGE_WIDTH / 2) - 1,
                -BEACON_GAUGE_RADIUS - 1,
                evaluate(BEACON_GAUGE_WIDTH + 2),
                evaluate(BEACON_GAUGE_HEIGHT + 2)
            );

            R.fillStyle = '#0f0';
            fillRect(
                evaluate(-BEACON_GAUGE_WIDTH / 2) * this.playerTeamOwned,
                -BEACON_GAUGE_RADIUS,
                BEACON_GAUGE_WIDTH * this.playerTeamOwned,
                BEACON_GAUGE_HEIGHT
            );

            R.fillStyle = '#f00';
            fillRect(
                evaluate(-BEACON_GAUGE_WIDTH / 2) * this.enemyTeamOwned,
                -BEACON_GAUGE_RADIUS,
                BEACON_GAUGE_WIDTH * this.enemyTeamOwned,
                BEACON_GAUGE_HEIGHT
            );
        }
    }

    drawArc(angle, radius) {
        wrap(() => {
            rotate(angle);

            beginPath();
            arc(0, 0, radius, 0, PI / 3, false);
            stroke();
        });
    }

    get index() {
        return W.beacons.indexOf(this) + 1;
    }

    conqueredAnimation() {
        for (let i = 0 ; i < 100 ; i++) {
            const angle = rand(0, PI * 2);
            const dist = rand(100, 200);
            const t = rand(0.5, 1.5);
            particle(5, this.team.body, [
                ['x', this.x, this.x + cos(angle) * dist, t, 0, easeOutQuad],
                ['y', this.y, this.y + sin(angle) * dist, t, 0, easeOutQuad],
                ['s', rand(5, 10), 0, t]
            ], true);
        }

        const effect = {
            'radius': 0,
            'render': () => {
                const beaconRow = ~~(this.y / GRID_SIZE);
                const beaconCol = ~~(this.x / GRID_SIZE);
                const radiusCells = ceil(effect.radius / GRID_SIZE);

                R.fillStyle = this.team.beacon;
                R.globalAlpha = 0.2;

                for (let row = beaconRow - radiusCells ; row < beaconRow + radiusCells ; row++) {
                    for (let col = beaconCol - radiusCells ; col < beaconCol + radiusCells ; col++) {
                        const center = {
                            'x': (col + 0.5) * GRID_SIZE,
                            'y': (row + 0.5) * GRID_SIZE
                        };
                        const angle = angleBetween(this, center);
                        if (
                            // dist(this, center) < dist(this, {'x': this.x + cos(angle) * effect.radius, 'y': this.y + sin(angle) * effect.radius})
                            isBetween(center.x - GRID_SIZE / 2, this.x + cos(angle) * effect.radius, center.x + GRID_SIZE / 2) &&
                            isBetween(center.y - GRID_SIZE / 2, this.y + sin(angle) * effect.radius, center.y + GRID_SIZE / 2)
                        ) {
                            fillRect(center.x - GRID_SIZE / 2, center.y - GRID_SIZE / 2, GRID_SIZE, GRID_SIZE);
                        }
                    }
                }
            }
        };
        W.add(effect, RENDERABLE);

        interp(effect, 'radius', 0, GRID_SIZE * 10, 1, 0, easeOutQuad, () => W.remove(effect));
    }

}
