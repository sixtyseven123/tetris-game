const Achievements = {
    LIST: {
        FIRST_GAME: {
            id: 'first_game',
            name: '初次体验',
            description: '完成你的第一场游戏',
            icon: '🎮',
            condition: '完成任意一局游戏'
        },
        HIGH_SCORE: {
            id: 'high_score',
            name: '满分挑战',
            description: '单局游戏达到5000分',
            icon: '🏆',
            condition: '分数达到5000分',
            targetScore: 5000
        },
        SPEED_KING: {
            id: 'speed_king',
            name: '速度之王',
            description: '在最快难度下坚持超过1分钟',
            icon: '⚡',
            condition: '困难模式下存活超过60秒',
            targetTime: 60
        },
        LINE_MASTER: {
            id: 'line_master',
            name: '消行大师',
            description: '单局游戏消除50行',
            icon: '📊',
            condition: '消除50行',
            targetLines: 50
        },
        TETRIS: {
            id: 'tetris',
            name: '俄罗斯方块',
            description: '完成一次四行消除',
            icon: '🧱',
            condition: '一次性消除4行'
        },
        STREAK: {
            id: 'streak',
            name: '连胜达人',
            description: '连续3局游戏得分超过1000',
            icon: '🔥',
            condition: '连续3局得分超过1000',
            targetStreak: 3
        }
    },

    unlockedAchievements: [],
    currentStreak: 0,

    init() {
        this.unlockedAchievements = Storage.getAchievements();
        const streakData = localStorage.getItem('tetris_streak');
        this.currentStreak = streakData ? parseInt(streakData, 10) : 0;
    },

    checkAchievements(gameData) {
        const { score, lines, duration, difficulty } = gameData;
        let newlyUnlocked = [];

        if (!this.isUnlocked('first_game')) {
            if (score > 0) {
                this.unlock('first_game');
                newlyUnlocked.push(this.LIST.FIRST_GAME);
            }
        }

        if (!this.isUnlocked('high_score')) {
            if (score >= this.LIST.HIGH_SCORE.targetScore) {
                this.unlock('high_score');
                newlyUnlocked.push(this.LIST.HIGH_SCORE);
            }
        }

        if (!this.isUnlocked('speed_king')) {
            if (difficulty === 'hard' && duration >= this.LIST.SPEED_KING.targetTime) {
                this.unlock('speed_king');
                newlyUnlocked.push(this.LIST.SPEED_KING);
            }
        }

        if (!this.isUnlocked('line_master')) {
            if (lines >= this.LIST.LINE_MASTER.targetLines) {
                this.unlock('line_master');
                newlyUnlocked.push(this.LIST.LINE_MASTER);
            }
        }

        if (!this.isUnlocked('tetris')) {
            if (gameData.hasTetris) {
                this.unlock('tetris');
                newlyUnlocked.push(this.LIST.TETRIS);
            }
        }

        if (!this.isUnlocked('streak')) {
            if (score > 1000) {
                this.currentStreak++;
                localStorage.setItem('tetris_streak', this.currentStreak.toString());
                if (this.currentStreak >= this.LIST.STREAK.targetStreak) {
                    this.unlock('streak');
                    newlyUnlocked.push(this.LIST.STREAK);
                }
            } else {
                this.currentStreak = 0;
                localStorage.setItem('tetris_streak', '0');
            }
        }

        if (newlyUnlocked.length > 0) {
            this.showAchievementNotification(newlyUnlocked);
        }

        return newlyUnlocked;
    },

    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    },

    unlock(achievementId) {
        if (!this.isUnlocked(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            Storage.saveAchievements(this.unlockedAchievements);
        }
    },

    showAchievementNotification(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'achievement-notification';
                notification.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                `;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 50);

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 3000);
            }, index * 500);
        });
    },

    getAllAchievements() {
        return Object.values(this.LIST).map(achievement => ({
            ...achievement,
            unlocked: this.isUnlocked(achievement.id)
        }));
    },

    getUnlockedCount() {
        return this.unlockedAchievements.length;
    },

    getTotalCount() {
        return Object.keys(this.LIST).length;
    }
};