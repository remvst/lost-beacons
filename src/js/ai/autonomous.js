class Autonomous extends Behavior {

    constructor() {
        super();
        this.nextCheck = 0;
        this.currentDecision = null;
    }

    attach(unit) {
        super.attach(unit);

        this.updateSubBehavior();
    }

    healthInArea(point, team, radius) {
        // console.log(point, team, radius);
        return W.units
            .filter(c => c.team == team)
            .filter(unit => dist(unit, point) < radius)
            .reduce((health, unit) => health + unit.health, 0);
    }

    retreatPosition() {
        const positions = [];
        for (let i = 0 ; i < 10 ; i++) {
            const a = (i / 10) * PI * 2;
            positions.push({
                'x': this.unit.x + cos(a) * evaluate(UNIT_ATTACK_RADIUS * 4),
                'y': this.unit.y + sin(a) * evaluate(UNIT_ATTACK_RADIUS * 4)
            });
        }

        // Return a position that is available and not close to any enemy
        return pick(
            positions
                .filter(position => !W.pointInObstacle(position))
                .filter(position => this.healthInArea(position, this.unit.team.enemy, UNIT_ATTACK_RADIUS * 2) <= 0)
        );
    }

    enemyUnit() {
        return W.units
            .filter(unit => unit.team == this.unit.team.enemy)
            .filter(unit => this.healthInArea(unit, unit.team, UNIT_ATTACK_RADIUS * 2) <= this.healthAroundSelf())
            .sort((a, b) => dist(a, this.unit) - dist(b, this.unit))[0];
    }

    friendlyUnit() {
        return W.units
            .filter(unit => unit != this.unit && unit.team == this.unit.team)
            .filter(unit => this.healthInArea(unit, unit.team.enemy, UNIT_ATTACK_RADIUS * 2) <= 0)
            .sort((a, b) => dist(a, this.unit) - dist(b, this.unit))[0];
    }

    conquerableBeacon() {
        return W.beacons
            .filter(beacon => beacon.team != this.unit.team)
            .filter(beacon => this.healthInArea(beacon, this.unit.team.enemy, UNIT_ATTACK_RADIUS * 2) <= 0)
            .sort((a, b) => dist(a, this.unit) - dist(b, this.unit))[0];
    }

    defendableBeacon() {
        return W.beacons
            .filter(beacon => beacon.team != this.unit.team.enemy) // beacons that are owned or neutral
            .filter(beacon => this.healthInArea(beacon, this.unit.team.enemy, BEACON_CONQUER_RADIUS * 2) > 0)
            .sort((a, b) => dist(a, this.unit) - dist(b, this.unit))[0];
    }

    healthAroundSelf() {
        return this.healthInArea(this.unit, this.unit.team, UNIT_ATTACK_RADIUS * 2);
    }

    updateSubBehavior() {
        if (this.currentDecision) {
            if (!this.currentDecision.done() && !this.currentDecision.bad()) {
                return;
            }
        }

        let decisions = [];

        const retreatPosition = this.retreatPosition();
        if (retreatPosition) {
            const retreatBehavior = new Reach(retreatPosition);
            const retreatDecision = {
                'behavior': retreatBehavior,
                'done': () => {
                    return dist(retreatBehavior.target, this.unit) <= UNIT_ATTACK_RADIUS && this.healthInArea(this.unit, this.unit.team.enemy, UNIT_ATTACK_RADIUS) == 0;
                },
                'bad': () => {
                    return this.healthInArea(retreatBehavior.target, this.unit.team.enemy, UNIT_ATTACK_RADIUS * 4) > 0;
                }
            };
            if (DEBUG) {
                retreatDecision.label = 'retreat';
            }
            decisions.push(retreatDecision);
        }

        const attackedUnit = this.enemyUnit();
        if (attackedUnit) {
            const attackBehavior = new Chase(attackedUnit);
            const attackDecision = {
                'behavior': attackBehavior,
                'done': () => {
                    return attackedUnit.dead;
                },
                'bad': () => {
                    return this.healthInArea(attackedUnit, attackedUnit.team, UNIT_ATTACK_RADIUS) > this.healthAroundSelf() + 2;
                }
            };
            if (DEBUG) {
                attackDecision.label = 'attack';
            }
            decisions.push(attackDecision);
        }

        const friend = this.friendlyUnit();
        if (friend) {
            const regroupBehavior = new Chase(friend);
            const regroupDecision = {
                'behavior': regroupBehavior,
                'done': () => {
                    return dist(friend, this.unit) < UNIT_ATTACK_RADIUS;
                },
                'bad': () => {
                    return this.healthInArea(friend, friend.team.enemy, UNIT_ATTACK_RADIUS) > this.healthInArea(friend, friend.team, UNIT_ATTACK_RADIUS) + 2;
                }
            };
            if (DEBUG) {
                regroupDecision.label = 'regroup';
            }
            decisions.push(regroupDecision);
        }

        const conquerableBeacon = this.conquerableBeacon();
        if (conquerableBeacon) {
            const conquerBehavior = new Reach(conquerableBeacon);
            const conquerDecision = {
                'behavior': conquerBehavior,
                'done': () => {
                    return conquerableBeacon.team == this.unit.team;
                },
                'bad': () => {
                    return this.healthInArea(conquerableBeacon, this.unit.team.enemy, UNIT_ATTACK_RADIUS) > this.healthInArea(conquerableBeacon, this.unit.team, UNIT_ATTACK_RADIUS) + 2;
                }
            };
            if (DEBUG) {
                conquerDecision.label = 'conquer';
            }
            decisions.push(conquerDecision);
        }

        const defendableBeacon = this.defendableBeacon();
        if (defendableBeacon) {
            const defendBehavior = new Reach(defendableBeacon);
            const defendDecision = {
                'behavior': defendBehavior,
                'done': () => {
                    // Done if no one is trying to conquer it anymore
                    return this.healthInArea(defendableBeacon, this.unit.team.enemy, BEACON_CONQUER_RADIUS) == 0;
                },
                'bad': () => {
                    // Bad if enemies have a strong advantage
                    return this.healthInArea(defendableBeacon, this.unit.team.enemy, UNIT_ATTACK_RADIUS) > this.healthInArea(defendableBeacon, this.unit.team, UNIT_ATTACK_RADIUS) + 2;
                }
            };
            if (DEBUG) {
                defendDecision.label = 'defend';
            }
            decisions.push(defendDecision);
        }

        const goodDecisions = decisions.filter(decision => !decision.done() && !decision.bad());

        const decision = pick(goodDecisions);
        if (!decision) {
            return;
        }

        this.currentDecision = decision;
        this.subBehavior = this.currentDecision.behavior;
        this.subBehavior.attach(this.unit);
    }

    cycle(e) {
        super.cycle(e);

        this.nextCheck -= e;
        if (this.nextCheck <= 0) {
            this.nextCheck = 5;
            this.updateSubBehavior();
        }

        if (this.subBehavior) {
            this.subBehavior.cycle(e);
        }
    }

    reconsider() {
        return this; // never change the AI
    }

    render() {
        if (DEBUG ) {
            R.fillStyle = '#f00';
            R.font = '10pt Arial';
            R.textAlign = 'center';
            if (this.currentDecision) {
                fillText(this.currentDecision.label, this.unit.x, this.unit.y + 35);
            }
        }

        if (this.subBehavior) {
            this.subBehavior.render();
        }
    }

    reservedPosition() {
        return this.subBehavior ? this.subBehavior.reservedPosition() : this.unit;
    }

}
