class HealCursor extends ChaseCursor {

    get color() {
        return '#0f0';
    }

    get label() {
        return nomangle('HEAL()');
    }

    get period() {
        return HEAL_CURSOR_PERIOD;
    }

    get chaseRadius() {
        return UNIT_HEAL_RADIUS;
    }

}
