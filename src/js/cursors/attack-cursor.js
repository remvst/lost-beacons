class AttackCursor extends Cursor {

    get color() {
        return '#900';
    }

    get label() {
        return nomangle('HEAL()');
    }

    get period() {
        return ATTACK_CURSOR_PERIOD;
    }

    get chaseRadius() {
        return UNIT_ATTACK_RADIUS;
    }

}
