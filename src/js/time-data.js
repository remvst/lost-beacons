class TimeData {

    static saveTime(levelId, time) {
        if (DEBUG) {
            console.log('Time for level #' + levelId + ' -> ' + time);
        }

        try {
            localStorage['_' + levelId] = min(time, this.timeForLevelIndex(levelId) || Number.MAX_VALUE);
        } catch(e) {

        }
    }

    static timeForLevelIndex(levelId) {
        return localStorage['_' + levelId] || 0;
    }

}
