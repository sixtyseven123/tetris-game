const Game = {
    COLS: 10,
    ROWS: 20,
    BLOCK_SIZE: 30,
    COLORS: [
        null,
        '#00f5ff',
        '#0000ff',
        '#ffa500',
        '#ffff00',
        '#00ff00',
        '#800080',
        '#ff0000'
    ],
    SHAPES: [
        null,
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
        [[2,0,0], [2,2,2], [0,0,0]],
        [[0,0,3], [3,3,3], [0,0,0]],
        [[4,4], [4,4]],
        [[0,5,5], [5,5,0], [0,0,0]],
        [[0,6,0], [6,6,6], [0,0,0]],
        [[7,7,0], [0,7,7], [0,0,0]]
    ],
    SCORE_VALUES: [0, 100, 300, 500, 800],
    DIFFICULTY_SPEEDS: { easy: 1000, normal: 700, hard: 400 },

    state: 'idle',
    board: null,
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
    currentPiece: null,
    nextPiece: null,
    gameInterval: null,
    speed: 700,
    replayData: [],
    replayIndex: 0,
    isReplaying: false,
    pieceSequence: [],
    pieceIndex: 0,
    gridCols: 10,
    gridRows: 20,

    init(difficulty = 'normal') {
        this.COLS = this.gridCols;
        this.ROWS = this.gridRows;
        this.speed = this.DIFFICULTY_SPEEDS[difficulty] || 700;
        this.board = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(null));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.highScore = Storage.getHighScore();
        this.state = 'idle';
        this.currentPiece = null;
        this.nextPiece = null;
        this.replayData = [];
        this.replayIndex = 0;
        this.isReplaying = false;
        this.pieceSequence = [];
        this.pieceIndex = 0;
        if (this.gameInterval) clearInterval(this.gameInterval);
    },

    start() {
        if (this.state === 'playing') return;
        Audio.init();
        Audio.resume();
        this.state = 'playing';
        this.board = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(null));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.replayData = [];
        this.pieceSequence = [];
        this.pieceIndex = 0;
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.updateScoreDisplay();
        Renderer.setGridSize(this.gridCols, this.gridRows);
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
        this.startGameLoop();
        Audio.playStart();
        Audio.startMusic();
        UI.hideGameOver();
        UI.updateStartButton('游戏中');
    },

    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            clearInterval(this.gameInterval);
            UI.updatePauseButton('继续');
            Audio.stopMusic();
        } else if (this.state === 'paused') {
            this.resume();
        }
    },

    resume() {
        if (this.state !== 'paused') return;
        this.state = 'playing';
        this.startGameLoop();
        UI.updatePauseButton('暂停');
        if (Audio.musicEnabled) Audio.startMusic();
    },

    restart() {
        this.init();
        this.start();
    },

    startGameLoop() {
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.tick(), this.speed);
    },

    tick() {
        if (this.state !== 'playing' || this.isReplaying) return;
        this.drop();
    },

    drop() {
        if (!this.currentPiece) return;
        if (!this.currentPiece.collidesBoard(0, 1)) {
            this.currentPiece.y++;
            if (!this.isReplaying) {
                this.logAction('drop', {});
            }
        } else {
            this.lockPiece();
        }
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
    },

    moveLeft() {
        if (this.state !== 'playing' || !this.currentPiece) return;
        if (!this.currentPiece.collidesBoard(-1, 0)) {
            this.currentPiece.x--;
            this.logAction('move', { direction: 'left' });
            Audio.playMove();
            Renderer.render(this.board, this.currentPiece, this.nextPiece);
        }
    },

    moveRight() {
        if (this.state !== 'playing' || !this.currentPiece) return;
        if (!this.currentPiece.collidesBoard(1, 0)) {
            this.currentPiece.x++;
            this.logAction('move', { direction: 'right' });
            Audio.playMove();
            Renderer.render(this.board, this.currentPiece, this.nextPiece);
        }
    },

    moveDown() {
        if (this.state !== 'playing' || !this.currentPiece) return;
        if (!this.currentPiece.collidesBoard(0, 1)) {
            this.currentPiece.y++;
            this.score += 1;
            this.logAction('move', { direction: 'down' });
            Audio.playMove();
            this.updateScoreDisplay();
            Renderer.render(this.board, this.currentPiece, this.nextPiece);
        }
    },

    rotate() {
        if (this.state !== 'playing' || !this.currentPiece) return;
        this.currentPiece.rotate();
        this.logAction('rotate', {});
        Audio.playRotate();
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
    },

    hardDrop() {
        if (this.state !== 'playing' || !this.currentPiece) return;
        const startY = this.currentPiece.y;
        while (!this.currentPiece.collidesBoard(0, 1)) {
            this.currentPiece.y++;
        }
        this.logAction('hardDrop', { startY, endY: this.currentPiece.y });
        Audio.playDrop();
        this.lockPiece();
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
    },

    lockPiece() {
        const gameOver = this.currentPiece.lock();
        if (gameOver) {
            this.endGame();
            return;
        }
        this.logAction('lock', {});
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.logAction('newPiece', {});
        
        if (this.currentPiece.collidesBoard(0, 0)) {
            this.endGame();
        }
    },

    clearLines() {
        let clearedLines = [];
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell)) {
                clearedLines.push(row);
            }
        }
        if (clearedLines.length > 0) {
            clearedLines.forEach((row, index) => {
                Animations.triggerLineClear(row, () => {
                    this.board.splice(row, 1);
                    this.board.unshift(new Array(this.COLS).fill(null));
                });
            });
            setTimeout(() => {
                const points = this.SCORE_VALUES[clearedLines.length] || 0;
                this.score += points * this.level;
                this.lines += clearedLines.length;
                this.level = Math.floor(this.score / 1000) + 1;
                this.updateScoreDisplay();
                Audio.playClear(clearedLines.length);
                if (clearedLines.length >= 2) {
                    Animations.pulseElement(document.getElementById('score'));
                }
                this.logAction('clear', { lines: clearedLines.length, points: points * this.level });
                Renderer.render(this.board, this.currentPiece, this.nextPiece);
            }, clearedLines.length * 50);
        }
    },

    endGame() {
        this.state = 'gameover';
        clearInterval(this.gameInterval);
        Audio.playGameOver();
        Audio.stopMusic();
        const isNewHighScore = Storage.setHighScore(this.score);
        Storage.addToLeaderboard(this.score);
        Storage.saveReplay({
            actions: this.replayData,
            pieces: this.pieceSequence,
            settings: { cols: this.gridCols, rows: this.gridRows, difficulty: Storage.getSettings().difficulty }
        });
        this.highScore = Storage.getHighScore();
        Animations.triggerGameOver(() => {
            UI.showGameOver(this.score, this.lines, isNewHighScore);
            UI.updateStartButton('开始游戏');
        });
    },

    createPiece() {
        let type;
        if (this.isReplaying && this.pieceIndex < this.pieceSequence.length) {
            type = this.pieceSequence[this.pieceIndex++];
        } else {
            type = Math.floor(Math.random() * 7) + 1;
            if (!this.isReplaying) {
                this.pieceSequence.push(type);
            }
        }
        return new Piece(type, this.COLS, this.ROWS);
    },

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('highScore').textContent = this.highScore;
    },

    logAction(type, data) {
        this.replayData.push({
            type,
            data,
            timestamp: Date.now() - (this.replayStartTime || Date.now())
        });
    },

    startReplay(onComplete) {
        const replayData = Storage.getReplay();
        if (!replayData || !replayData.actions || replayData.actions.length === 0) return;
        
        this.replayData = replayData.actions;
        this.pieceSequence = replayData.pieces || [];
        
        this.isReplaying = true;
        this.replayIndex = 0;
        this.pieceIndex = 0;
        this.replayStartTime = Date.now();
        this.state = 'playing';
        
        if (replayData.settings) {
            this.setGridSize(replayData.settings.cols || 10, replayData.settings.rows || 20);
            this.speed = this.DIFFICULTY_SPEEDS[replayData.settings.difficulty] || 700;
        }
        this.COLS = this.gridCols;
        this.ROWS = this.gridRows;
        
        this.board = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(null));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        
        Renderer.setGridSize(this.gridCols, this.gridRows);
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
        this.updateScoreDisplay();
        this.playNextReplayAction(onComplete);
    },

    playNextReplayAction(onComplete) {
        if (this.replayIndex >= this.replayData.length) {
            this.isReplaying = false;
            if (onComplete) onComplete();
            return;
        }
        const action = this.replayData[this.replayIndex];
        setTimeout(() => {
            this.executeReplayAction(action);
            this.replayIndex++;
            this.playNextReplayAction(onComplete);
        }, 50);
    },

    executeReplayAction(action) {
        switch (action.type) {
            case 'move':
                if (action.data.direction === 'left') this.currentPiece.x--;
                if (action.data.direction === 'right') this.currentPiece.x++;
                if (action.data.direction === 'down') {
                    this.currentPiece.y++;
                    this.score += 1;
                }
                break;
            case 'drop':
                this.currentPiece.y++;
                break;
            case 'rotate':
                this.currentPiece.rotate();
                break;
            case 'hardDrop':
                while (!this.currentPiece.collidesBoard(0, 1)) {
                    this.currentPiece.y++;
                }
                this.lockPieceReplay();
                break;
            case 'lock':
                if (this.currentPiece) {
                    const gameOver = this.currentPiece.lock();
                    if (gameOver) {
                        this.isReplaying = false;
                        this.state = 'gameover';
                    } else {
                        this.currentPiece = this.nextPiece;
                        this.nextPiece = this.createPiece();
                    }
                }
                break;
            case 'newPiece':
                if (!this.currentPiece) {
                    this.currentPiece = this.nextPiece;
                    this.nextPiece = this.createPiece();
                }
                break;
            case 'clear':
                this.clearLinesReplay(action.data.lines);
                this.score += this.SCORE_VALUES[action.data.lines] * this.level;
                this.lines += action.data.lines;
                this.level = Math.floor(this.score / 1000) + 1;
                break;
        }
        this.updateScoreDisplay();
        Renderer.render(this.board, this.currentPiece, this.nextPiece);
    },

    lockPieceReplay() {
        if (!this.currentPiece) return;
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    if (this.currentPiece.y + row >= 0) {
                        this.board[this.currentPiece.y + row][this.currentPiece.x + col] = this.currentPiece.color;
                    }
                }
            }
        }
        this.currentPiece = null;
    },

    clearLinesReplay(count) {
        for (let i = 0; i < count; i++) {
            for (let row = this.ROWS - 1; row >= 0; row--) {
                if (this.board[row].every(cell => cell)) {
                    this.board.splice(row, 1);
                    this.board.unshift(new Array(this.COLS).fill(null));
                    row++;
                }
            }
        }
    },

    setDifficulty(difficulty) {
        this.speed = this.DIFFICULTY_SPEEDS[difficulty] || 700;
        if (this.state === 'playing') {
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => this.tick(), this.speed);
        }
    },

    setGridSize(cols, rows) {
        this.gridCols = cols;
        this.gridRows = rows;
        this.COLS = cols;
        this.ROWS = rows;
        Renderer.setGridSize(cols, rows);
        if (this.state === 'idle') {
            this.board = Array.from({ length: this.ROWS }, () => new Array(this.COLS).fill(null));
            Renderer.render(this.board, this.currentPiece, this.nextPiece);
        }
    }
};

class Piece {
    constructor(type, cols, rows) {
        this.type = type;
        this.shape = Game.SHAPES[type].map(row => [...row]);
        this.color = Game.COLORS[type];
        this.x = Math.floor(cols / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
        this.visualOffsetX = 0;
        this.visualOffsetY = 0;
        this.cols = cols;
        this.rows = rows;
    }

    rotate() {
        const newShape = this.shape[0].map((_, i) =>
            this.shape.map(row => row[i]).reverse()
        );
        const oldShape = this.shape.map(row => [...row]);
        this.shape = newShape;
        
        const kicks = [-1, 1, -2, 2];
        
        if (this.collidesBoard(0, 0)) {
            let kicked = false;
            for (const kick of kicks) {
                if (!this.collidesBoard(kick, 0)) {
                    this.x += kick;
                    kicked = true;
                    break;
                }
            }
            if (!kicked) {
                this.shape = oldShape;
            }
        }
    }

    collidesBoard(dx, dy) {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    const newX = this.x + col + dx;
                    const newY = this.y + row + dy;
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    if (newY >= 0 && Game.board[newY] && Game.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lock() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    if (this.y + row < 0) {
                        return true;
                    }
                    Game.board[this.y + row][this.x + col] = this.color;
                }
            }
        }
        return false;
    }
}
