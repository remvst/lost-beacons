class HealCursor extends ChaseCursor {

    get color() {
        return '#0f0';
    }

    get label() {
        return nomangle('HEAL()');
    }

    get chaseRadius() {
        return UNIT_HEAL_RADIUS;
    }

}
