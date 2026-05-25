const Renderer = {
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    blockSize: 30,
    cols: 10,
    rows: 20,
    backgroundImage: null,
    blockImage: null,
    useBackground: false,
    useBlockSkin: false,

    init(canvasId, nextCanvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById(nextCanvasId);
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.canvas.dataset.blockSize = this.blockSize;
    },

    setGridSize(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.blockSize = Math.floor(Math.min(600 / rows, 300 / cols));
        this.canvas.width = cols * this.blockSize;
        this.canvas.height = rows * this.blockSize;
        this.canvas.dataset.blockSize = this.blockSize;
        this.nextCanvas.width = 4 * this.blockSize;
        this.nextCanvas.height = 4 * this.blockSize;
    },

    setBackground(imagePath) {
        const img = new Image();
        img.onload = () => {
            this.backgroundImage = img;
            this.useBackground = true;
        };
        img.src = imagePath;
    },

    setBlockSkin(imagePath) {
        const img = new Image();
        img.onload = () => {
            this.blockImage = img;
            this.useBlockSkin = true;
        };
        img.src = imagePath;
    },

    clearBoard() {
        this.ctx.fillStyle = '#0a2140';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.useBackground && this.backgroundImage) {
            this.ctx.globalAlpha = 0.3;
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1;
        }
    },

    drawGrid() {
        this.ctx.strokeStyle = '#1f4068';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    },

    drawBlock(x, y, color, isGhost = false) {
        const px = x * this.blockSize;
        const py = y * this.blockSize;
        if (this.useBlockSkin && this.blockImage && !isGhost) {
            this.ctx.drawImage(
                this.blockImage,
                0, 0, 30, 30,
                px + 1, py + 1, this.blockSize - 2, this.blockSize - 2
            );
        } else {
            this.ctx.fillStyle = isGhost ? 'rgba(255,255,255,0.2)' : color;
            this.ctx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize - 2);
            if (!isGhost) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize / 3);
                this.ctx.fillRect(px + 1, py + 1, this.blockSize / 3, this.blockSize - 2);
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.fillRect(px + this.blockSize / 3, py + this.blockSize - this.blockSize / 3 - 1, this.blockSize / 3 * 2, this.blockSize / 3);
                this.ctx.fillRect(px + this.blockSize - this.blockSize / 3 - 1, py + this.blockSize / 3, this.blockSize / 3, this.blockSize / 3 * 2);
            }
        }
    },

    drawBoard(board) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (board[row] && board[row][col]) {
                    this.drawBlock(col, row, board[row][col]);
                }
            }
        }
    },

    drawPiece(piece) {
        if (!piece) return;
        const offsetX = piece.visualOffsetX || 0;
        const offsetY = piece.visualOffsetY || 0;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    this.drawBlock(
                        piece.x + col,
                        piece.y + row,
                        piece.color
                    );
                }
            }
        }
    },

    drawGhostPiece(piece) {
        if (!piece) return;
        let ghostY = piece.y;
        while (!piece.collidesBoard(0, ghostY - piece.y + 1)) {
            ghostY++;
        }
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    this.drawBlock(
                        piece.x + col,
                        ghostY + row,
                        piece.color,
                        true
                    );
                }
            }
        }
    },

    clearNext() {
        this.nextCtx.fillStyle = '#0a2140';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    },

    drawNextPiece(piece) {
        this.clearNext();
        if (!piece) return;
        const shape = piece.shape;
        const pieceWidth = shape[0].length * this.blockSize;
        const pieceHeight = shape.length * this.blockSize;
        const offsetX = (this.nextCanvas.width - pieceWidth) / 2;
        const offsetY = (this.nextCanvas.height - pieceHeight) / 2;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const px = offsetX + col * this.blockSize;
                    const py = offsetY + row * this.blockSize;
                    this.nextCtx.fillStyle = piece.color;
                    this.nextCtx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize - 2);
                    this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.nextCtx.fillRect(px + 1, py + 1, this.blockSize - 2, this.blockSize / 3);
                    this.nextCtx.fillRect(px + 1, py + 1, this.blockSize / 3, this.blockSize - 2);
                }
            }
        }
    },

    render(board, currentPiece, nextPiece) {
        this.clearBoard();
        this.drawGrid();
        this.drawBoard(board);
        if (currentPiece) {
            this.drawGhostPiece(currentPiece);
            this.drawPiece(currentPiece);
        }
        this.drawNextPiece(nextPiece);
    }
};
