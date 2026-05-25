const Storage = {
    KEYS: {
        HIGH_SCORE: 'tetris_highScore',
        LEADERBOARD: 'tetris_leaderBOARD',
        REPLAY: 'tetris_replay',
        SETTINGS: 'tetris_settings'
    },

    getHighScore() {
        const score = localStorage.getItem(this.KEYS.HIGH_SCORE);
        return score ? parseInt(score, 10) : 0;
    },

    setHighScore(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem(this.KEYS.HIGH_SCORE, score.toString());
            return true;
        }
        return false;
    },

    getLeaderboard() {
        const data = localStorage.getItem(this.KEYS.LEADERBOARD);
        return data ? JSON.parse(data) : [];
    },

    addToLeaderboard(score) {
        const leaderboard = this.getLeaderboard();
        const entry = {
            score: score,
            date: new Date().toISOString().split('T')[0]
        };
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        const top10 = leaderboard.slice(0, 10);
        localStorage.setItem(this.KEYS.LEADERBOARD, JSON.stringify(top10));
        return top10;
    },

    clearLeaderboard() {
        localStorage.removeItem(this.KEYS.LEADERBOARD);
    },

    saveReplay(actions) {
        localStorage.setItem(this.KEYS.REPLAY, JSON.stringify(actions));
    },

    getReplay() {
        const data = localStorage.getItem(this.KEYS.REPLAY);
        return data ? JSON.parse(data) : [];
    },

    clearReplay() {
        localStorage.removeItem(this.KEYS.REPLAY);
    },

    getSettings() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            difficulty: 'normal',
            gridSize: '10x20',
            theme: 'dark',
            soundEnabled: true,
            musicEnabled: false
        };
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    }
};
