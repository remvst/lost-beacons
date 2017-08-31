class TimeData {

    static saveTime(levelId, time) {
        if (DEBUG) {
            console.log('Time for level #' + levelId + ' -> ' + time);
        }

        try {
            localStorage['_' + levelId] = time;
        } catch(e) {

        }
    }

    static timeForLevelIndex(levelId) {
        return localStorage['_' + levelId] || 0;
    }

}
