const Transitions = {
    SCREEN_TYPES: {
        START: 'start',
        GAME_OVER: 'game_over',
        LEVEL_UP: 'level_up'
    },

    show(screenType, data = {}, callback) {
        const screen = document.createElement('div');
        screen.className = `transition-screen transition-${screenType}`;
        
        const content = this.generateContent(screenType, data);
        screen.innerHTML = content;
        
        document.body.appendChild(screen);
        
        setTimeout(() => {
            screen.classList.add('show');
        }, 50);

        if (screenType === this.SCREEN_TYPES.GAME_OVER) {
            this.animateGameOver(screen);
        } else if (screenType === this.SCREEN_TYPES.START) {
            this.animateStart(screen);
        } else if (screenType === this.SCREEN_TYPES.LEVEL_UP) {
            this.animateLevelUp(screen);
        }

        if (callback) {
            const duration = screenType === this.SCREEN_TYPES.GAME_OVER ? 2000 : 1500;
            setTimeout(() => {
                this.hide(screen, callback);
            }, duration);
        }
    },

    generateContent(screenType, data) {
        switch (screenType) {
            case this.SCREEN_TYPES.START:
                return `
                    <div class="transition-content">
                        <div class="start-title">
                            <span class="start-text">准备好了吗？</span>
                        </div>
                        <div class="start-subtitle">按下开始按钮开始游戏</div>
                        <div class="start-particles">
                            <div class="particle p1"></div>
                            <div class="particle p2"></div>
                            <div class="particle p3"></div>
                            <div class="particle p4"></div>
                            <div class="particle p5"></div>
                        </div>
                    </div>
                `;
            
            case this.SCREEN_TYPES.GAME_OVER:
                return `
                    <div class="transition-content">
                        <div class="gameover-title">
                            <span class="gameover-text">游戏结束</span>
                        </div>
                        ${data.isNewHighScore ? '<div class="new-record-badge">新纪录！</div>' : ''}
                        <div class="gameover-stats">
                            <div class="gameover-stat">
                                <span class="stat-num">${data.score || 0}</span>
                                <span class="stat-label">最终得分</span>
                            </div>
                            <div class="gameover-stat">
                                <span class="stat-num">${data.lines || 0}</span>
                                <span class="stat-label">消除行数</span>
                            </div>
                        </div>
                        <div class="gameover-pieces">
                            <div class="piece-icon i1"></div>
                            <div class="piece-icon i2"></div>
                            <div class="piece-icon i3"></div>
                            <div class="piece-icon i4"></div>
                        </div>
                    </div>
                `;
            
            case this.SCREEN_TYPES.LEVEL_UP:
                return `
                    <div class="transition-content">
                        <div class="levelup-title">
                            <span class="levelup-text">升级！</span>
                        </div>
                        <div class="levelup-level">
                            <span class="level-num">${data.level || 1}</span>
                        </div>
                        <div class="levelup-subtitle">速度提升！</div>
                        <div class="levelup-stars">
                            <div class="star s1">★</div>
                            <div class="star s2">★</div>
                            <div class="star s3">★</div>
                        </div>
                    </div>
                `;
            
            default:
                return '<div class="transition-content"><div>过渡中...</div></div>';
        }
    },

    animateStart(screen) {
        const particles = screen.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.2}s`;
        });
    },

    animateGameOver(screen) {
        const pieces = screen.querySelectorAll('.piece-icon');
        pieces.forEach((piece, index) => {
            piece.style.animationDelay = `${index * 0.15}s`;
        });
    },

    animateLevelUp(screen) {
        const stars = screen.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.animationDelay = `${index * 0.2}s`;
        });
    },

    hide(screen, callback) {
        screen.classList.remove('show');
        screen.classList.add('fade-out');
        
        setTimeout(() => {
            screen.remove();
            if (callback) callback();
        }, 300);
    },

    showLevelUp(level, callback) {
        this.show(this.SCREEN_TYPES.LEVEL_UP, { level }, callback);
    },

    showStart(callback) {
        this.show(this.SCREEN_TYPES.START, {}, callback);
    },

    showGameOver(score, lines, isNewHighScore, callback) {
        this.show(this.SCREEN_TYPES.GAME_OVER, { score, lines, isNewHighScore }, callback);
    }
};