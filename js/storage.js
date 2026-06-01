const Storage = {
    KEYS: {
        HIGH_SCORE: 'tetris_highScore',
        LEADERBOARD: 'tetris_leaderboard',
        REPLAY: 'tetris_replay',
        SETTINGS: 'tetris_settings',
        ACHIEVEMENTS: 'tetris_achievements',
        GUIDE_SHOWN: 'tetris_guide_shown',
        CURRENT_USER: 'tetris_current_user'
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

    addToLeaderboard(playerName, score, time) {
        const leaderboard = this.getLeaderboard();
        const entry = {
            id: Date.now(),
            playerName: playerName || '匿名玩家',
            score: score,
            time: time,
            date: new Date().toLocaleString('zh-CN')
        };
        leaderboard.push(entry);
        const top20 = leaderboard.slice(0, 20);
        localStorage.setItem(this.KEYS.LEADERBOARD, JSON.stringify(top20));
        return top20;
    },

    getLeaderboardSortedByScore() {
        const leaderboard = this.getLeaderboard();
        return [...leaderboard].sort((a, b) => b.score - a.score);
    },

    getLeaderboardSortedByTime() {
        const leaderboard = this.getLeaderboard();
        return [...leaderboard].sort((a, b) => a.time - b.time);
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
    },

    getAchievements() {
        const data = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
        return data ? JSON.parse(data) : [];
    },

    saveAchievements(achievements) {
        localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    },

    unlockAchievement(achievementId) {
        const achievements = this.getAchievements();
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.saveAchievements(achievements);
            return true;
        }
        return false;
    },

    isAchievementUnlocked(achievementId) {
        const achievements = this.getAchievements();
        return achievements.includes(achievementId);
    },

    getGuideShown() {
        const data = localStorage.getItem(this.KEYS.GUIDE_SHOWN);
        return data === 'true';
    },

    setGuideShown(value) {
        localStorage.setItem(this.KEYS.GUIDE_SHOWN, value.toString());
    },

    getCurrentUser() {
        const data = localStorage.getItem(this.KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : { name: '玩家', bestScore: 0 };
    },

    saveCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    }
};