class AttackCursor extends ChaseCursor {

    get color() {
        return '#900';
    }

    get label() {
        return nomangle('ATTACK()');
    }

    get chaseRadius() {
        return UNIT_ATTACK_RADIUS;
    }

}
