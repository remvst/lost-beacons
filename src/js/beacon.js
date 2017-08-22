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
        this.indicatorShowingTime = 0;
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

        const factor = BEACON_CONQUER_SPEED_PER_UNIT * max(1, abs(player.length - enemy.length));

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

            for (let i = 0 ; i < 100 ; i++) {
                const angle = rand(0, PI * 2);
                const dist = rand(100, 200);
                const t = rand(0.5, 1.5);
                particle(5, newOwner.body, [
                    ['x', this.x, this.x + cos(angle) * dist, t, 0, easeOutQuad],
                    ['y', this.y, this.y + sin(angle) * dist, t, 0, easeOutQuad],
                    ['s', rand(5, 10), 0, t]
                ], true);
            }

            this.nextReinforcements = 120;

            if (newOwner == PLAYER_TEAM) {
                this.indicate(nomangle('beacon captured'));
            } else if (newOwner == ENEMY_TEAM) {
                this.indicate(nomangle('enemy captured beacon'));
            } else if (actualConqueringTeam == ENEMY_TEAM) {
                this.indicate(nomangle('beacon lost'));
            }
        }

        if ((this.nextReinforcements -= e) < 0 && this.team != NEUTRAL_TEAM) {
            this.reinforcements();
        }

        this.indicatorShowingTime -= e;
    }

    indicate(label) {
        this.indicator.label = label;
        this.indicator.color = this.team.beacon;
        this.indicatorShowingTime = 4;
    }

    reinforcements() {
        this.nextReinforcements = 120;

        const unit = new Unit();
        unit.x = this.x;
        unit.y = this.y;
        unit.team = this.team;
        W.add(unit, CYCLABLE | RENDERABLE | UNIT);

        unit.setBehavior(this.team.behavior(this));
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

    postRender() {
        if (this.indicatorShowingTime > 0) {
            this.indicator.postRender();
        }

        translate(this.x, this.y);

        if (this.team != NEUTRAL_TEAM) {
            drawCenteredText(R, nomangle('reinforcements'), 0, 50, 2, this.team.beacon, true);
            drawCenteredText(R, formatTime(this.nextReinforcements), 0, 64, 2, this.team.beacon, true);
        }

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

}
